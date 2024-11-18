/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import TextInput from "./ui/TextInput";

export type OptionType = {
  value: any;
  label: string;
};

export type FieldType =
  | {
      type: "select";
      name: string;
      label: string;
      placeholder?: string;
      options?: OptionType[] | []; // For static options
      loadOptions?: (dependencyValue?: string) => Promise<OptionType[]>; // For async options
      isMulti?: boolean;
      isSearchable?: boolean;
      validation?: ZodTypeAny;
      dependsOn?: string; // Field name that this select depends on
      onChange?: (value: any) => void; // Custom onChange handler
    }
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
      validation?: ZodTypeAny;
    };

type ReusableFormProps = {
  fields: FieldType[];
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
  onValidDataChange?: (fieldName: string, fieldValue: any) => void;
};

const generateValidationSchema = (fields: FieldType[]) => {
  const schemaShape: any = {};

  fields.forEach((field) => {
    if (field.validation) {
      schemaShape[field.name] = field.validation;
    } else {
      // Default validation based on field type
      switch (field.type) {
        case "text":
          schemaShape[field.name] = z.string().nonempty(`${field.label} is required`);
          break;
        case "select":
          schemaShape[field.name] = z
            .object({
              value: z.string(),
              label: z.string(),
            })
            .nullable()
            .refine((val) => val !== null, {
              message: `${field.label} is required`,
            });
          break;
        default:
          break;
      }
    }
  });

  return z.object(schemaShape);
};

const FilterReusableForm: React.FC<ReusableFormProps> = ({
  fields,
  onSubmit,
  initialValues = {},
  onValidDataChange,
}) => {
  const validationSchema = generateValidationSchema(fields);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
  });

  const initialValuesRef = useRef(initialValues);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      // Check if initialValues have changed by comparing references
      const hasChanged = !Object.keys(initialValues).every(
        (key) => initialValues[key] === initialValuesRef.current[key],
      );
      console.log("Setting initial values: 0", initialValues, hasChanged);
      if (hasChanged) {
        console.log("Setting initial values: 1", initialValues);
        reset(initialValues);
        initialValuesRef.current = initialValues;
      }
    }
    console.log("----------, initialValues");
  }, [initialValues, reset]);


  // Store options for each field
  const [optionsState, setOptionsState] = React.useState<{
    [key: string]: OptionType[];
  }>({});

  // Get all dependency field names
  const dependencyFieldNames = Array.from(
    new Set(
      fields
        .filter((field) => field.type === "select" && field.dependsOn)
        .map((field) => ("dependsOn" in field ? field.dependsOn : undefined))
        .filter((dependsOn): dependsOn is string => dependsOn !== undefined),
    ),
  );

  // Monitor dependency values
  const dependencyValuesArray = useWatch({
    control,
    name: dependencyFieldNames,
  });

  // Map dependency field names to their values
  const dependencyMap = dependencyFieldNames.reduce((acc, name, index) => {
    acc[name] = dependencyValuesArray[index];
    return acc;
  }, {} as { [key: string]: any });

  // Handle dependent fields
  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "select" && field.dependsOn) {
        const dependencyValue = dependencyMap[field.dependsOn];
        console.log(`Dependency value for ${field.name}:`, dependencyValue);

        // Only load options if the dependency value has changed and is valid
        if (dependencyValue && dependencyValue !== "") {
          if (field.loadOptions) {
            field
              .loadOptions(dependencyValue.value)
              .then((options) => {
                setOptionsState((prev) => ({ ...prev, [field.name]: options }));
              })
              .catch((error) => {
                console.error(`Error loading options for ${field.name}:`, error);
                setOptionsState((prev) => ({ ...prev, [field.name]: [] }));
              });
          }
        } else {
          // Clear options if dependency is not selected
          setOptionsState((prev) => ({ ...prev, [field.name]: [] }));
          setValue(field.name, null); // Reset the current field value when dependency changes
        }
      }
    });
  }, [JSON.stringify(dependencyMap), fields, setValue]);

  // Load initial options for fields without dependencies
  useEffect(() => {
    fields.forEach(async (field) => {
      if (field.type === "select" && field.loadOptions && !field.dependsOn) {
        const options = await field.loadOptions();
        setOptionsState((prev) => ({ ...prev, [field.name]: options }));
      }
    });
  }, [fields]);

  // Watch form data for changes
  const watchedFields = useWatch({
    control,
  });

  // Call onValidDataChange whenever the form data changes
  React.useEffect(() => {
    if (onValidDataChange) {
      onValidDataChange(JSON.stringify(watchedFields), null);
    }
  }, [watchedFields]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='grid gap-2 lg:grid-cols-4 grid-cols-1  mb-4 border border-gray-200 px-4 py-3 pb-4 rounded-md'
    >
      {fields.map((field) => {
        switch (field.type) {
          case "select":
            const options = optionsState[field.name] || [];

            return (
              <div key={field.name}>
                <label className='block text-sm font-medium text-gray-700'>{field.label}</label>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: controllerField }) => (
                    <Select
                      {...controllerField}
                      options={options}
                      isClearable
                      isMulti={field.isMulti}
                      isSearchable={field.isSearchable}
                      placeholder={field.placeholder}
                      className={`mt-1 block w-full p-0 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      onChange={(value) => {
                        controllerField.onChange(value);
                        if (field.onChange) field.onChange(value);
                      }}
                    />
                  )}
                />
                {errors[field.name] && (
                  <p className='mt-2 text-sm text-red-600'>{errors[field.name]?.message?.toString()}</p>
                )}
              </div>
            );
          case "text":
            return (
              <div key={field.name}>
                <label className='block text-sm font-medium text-gray-700'>{field.label}</label>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: controllerField }) => (
                    <TextInput
                      {...controllerField}
                      type='text'
                      placeholder={field.placeholder}
                    />
                  )}
                />
                {errors[field.name] && (
                  <p className='mt-2 text-sm text-red-600'>{errors[field.name]?.message?.toString()}</p>
                )}
              </div>
            );
          default:
            return null;
        }
      })}
      {/* Submit Button */}
      {/* <button type='submit' className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'>
        Submit
      </button> */}
    </form>
  );
};

export default FilterReusableForm;
