import React, { useEffect, useRef } from "react";
import { useForm, Controller, FieldError, RefCallBack, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import TextInput from "./ui/TextInput";
import Select from "./ui/Select";
import Checkbox from "./ui/Checkbox";
import MultiSelect from "./ui/MultiSelect";
import NumberInput from "./ui/NumberInput";
import SingleDatePicker from "./ui/SingleDatePicker";
import DateRangePicker from "./ui/DateRangePicker";
import RadioButton from "./ui/RadioGroup";
import ToggleSwitch from "./ui/Switch";
import TextArea from "./ui/Textarea";
import TimePickerComponent from "./ui/TimeInput";
import UIButton from "./ui/Button";
import FileUploadComponent from "./ui/FileUpload";

export interface Field {
  type:
    | "text"
    | "password"
    | "phone"
    | "email"
    | "select"
    | "checkbox"
    | "multiselect"
    | "number"
    | "radio"
    | "singledate"
    | "daterange"
    | "switch"
    | "textarea"
    | "time"
    | string;
  name: string;
  label: string;
  value?: any;
  required?: boolean;
  placeholder?: string;
  min?: any;
  disabled?: boolean;
  max?: any;
  isMulti?: boolean;
  options?: { label: string; value: string | number }[] | string[];
  loadOptions?: (dependencyValue: any) => Promise<{ label: string; value: string | number }[]>;
  dependsOn?: string;
  onSelect?: (value: any) => void;
  onChange?: (value: any) => void;
  onBlur?: () => void;
}

export interface FieldGroup {
  group: string;
  fields: Field[];
}

interface DynamicFormProps {
  fields: FieldGroup[];
  schema: ZodSchema;
  onSubmit: (data: any) => void;
  onClose?: () => void;
  loading?: boolean;
  submitbuttonName: string;
  closebuttonName?: string;
  resetbuttonName?: string;
  innerFormButtonModel?: () => void;
  columnLayout?: 1 | 2 | 3 | 4;
  initialValues?: Record<string, any>;
  onValidDataChange?: (fieldName: string, fieldValue: any) => void;
}

const DynamicFormBuilder = ({
  fields,
  schema,
  onSubmit,
  onClose,
  loading,
  submitbuttonName,
  closebuttonName,
  resetbuttonName,
  innerFormButtonModel,
  columnLayout = 1,
  initialValues = {},
  onValidDataChange,
}: DynamicFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
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

  const [optionsState, setOptionsState] = React.useState<
    Record<string, { label: string; value: string | number }[]>
  >({});
  const [optionsLoaded, setOptionsLoaded] = React.useState<{ [key: string]: boolean }>({}); // {{ edit_1 }}

  console.log("errors", errors);
  // Get all dependency field names
  const dependencyFieldNames = Array.from(
    new Set(
      fields
        .flatMap((group) => group.fields)
        .filter((field) => field.type === "select" && field.dependsOn)
        .map((field) => field.dependsOn)
        .filter((dependsOn): dependsOn is string => dependsOn !== undefined),
    ),
  );

  const dependencyValuesArray = useWatch({
    control,
    name: dependencyFieldNames,
  });

  // Map dependency field names to their values
  const dependencyMap = dependencyFieldNames.reduce((acc, name, index) => {
    acc[name] = dependencyValuesArray[index];
    return acc;
  }, {} as { [key: string]: any });

  React.useEffect(() => {
    fields.forEach((group) => {
      group.fields.forEach((field) => {
        if (field.type === "select" || field.type === "multiselect") {
          const dependencyValue = dependencyMap[field.dependsOn || ""];

          // Check if options have already been loaded for this field
          if (field.dependsOn && dependencyValue && field.loadOptions) {
            // Always load options if editing
            field
              .loadOptions(dependencyValue)
              .then((options) => {
                setOptionsState((prev) => ({ ...prev, [field.name]: options }));
                setOptionsLoaded((prev) => ({ ...prev, [field.name]: true })); // Mark as loaded
              })
              .catch((error) => {
                console.error(`Error loading options for ${field.name}:`, error);
                setOptionsState((prev) => ({ ...prev, [field.name]: [] }));
              });
          }
        }
      });
    });
  }, [JSON.stringify(dependencyMap), fields]); // Removed optionsLoaded from dependencies

  React.useEffect(() => {
    fields.forEach((group) => {
      group.fields.forEach((field) => {
        if (field.type === "select" || field.type === "multiselect") {
          // Check if options have already been loaded for this field
          if (!field.dependsOn && field.loadOptions) {
            // Always load options if editing
            field
              .loadOptions(null)
              .then((options) => {
                setOptionsState((prev) => ({ ...prev, [field.name]: options }));
                setOptionsLoaded((prev) => ({ ...prev, [field.name]: true })); // Mark as loaded
              })
              .catch((error) => {
                console.error(`Error loading options for ${field.name}:`, error);
                setOptionsState((prev) => ({ ...prev, [field.name]: [] }));
              });
          }
        }
      });
    });
  }, [fields]); // Removed optionsLoaded from dependencies

  const watchedFields = useWatch({
    control,
  });

  React.useEffect(() => {
    if (onValidDataChange) {
      onValidDataChange(JSON.stringify(watchedFields), null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFields]);

  const renderField = (field: Field & { ref?: RefCallBack }) => {
    const error = errors[field.name] as FieldError | undefined;

    const commonProps = {
      name: field.name,
      label: field.label,
      value: field.value,
      error,
      min: field.min,
      max: field.max,
      checked: field.value,
      disabled: field.disabled,
      required: field.required,
      placeholder: field.placeholder,
      isMulti: field.isMulti,
      onChange: field.onChange,
      onBlur: field.onBlur,
      ref: field.ref,
    };
    const options = optionsState[field.name] || field.options || [];
    switch (field.type) {
      case "text":
      case "password":
      case "phone":
      case "year":
      case "email":
        return <TextInput {...commonProps} type={field.type} />;
      case "select":
        return <Select {...commonProps} options={options as { label: string; value: string }[]} />;
      case "checkbox":
        return <Checkbox {...commonProps} />;
      case "multiselect":
        return <MultiSelect {...commonProps} options={options as { label: string; value: string }[]} />;
      case "number":
        return <NumberInput {...commonProps} />;
      case "radio":
        return <RadioButton {...commonProps} options={field.options as { label: string; value: string }[]} />;
      case "singledate":
        return <SingleDatePicker {...commonProps} />;
      case "daterange":
        return <DateRangePicker {...commonProps} />;
      case "switch":
        return <ToggleSwitch {...commonProps} />;
      case "textarea":
        return <TextArea {...commonProps} />;
      case "time":
        return <TimePickerComponent {...commonProps} />;
      case "file":
        return <FileUploadComponent {...commonProps} />;
      case "button":
        return (
          <div className='max-w-fit'>
            <UIButton size={"sm"} {...commonProps} onClick={innerFormButtonModel}>
              {field.label}{" "}
            </UIButton>
          </div>
        );
      default:
        return <TextInput {...commonProps} type='text' />;
    }
  };

  const columnClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columnLayout];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {fields.map((group, groupIndex) => (
        <div key={groupIndex} className='space-y-4'>
          {group.group && <h3 className='font-semibold text-lg'>{group.group}</h3>}
          <div className={`grid ${columnClass} gap-4`}>
            {group.fields.map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) =>
                  renderField({
                    ...field,
                    onChange: (val) => {
                      onChange(val);
                      field.onChange?.(val);
                    },
                    onBlur: () => {
                      onBlur();
                      field.onBlur?.();
                    },
                    value,
                    ref,
                  })
                }
              />
            ))}
          </div>
        </div>
      ))}

      <div className='flex justify-end space-x-2'>
        {submitbuttonName && (
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-4 py-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            {loading ? "Loading..." : submitbuttonName}
          </button>
        )}
        {resetbuttonName && (
          <button
            type='reset'
            onClick={() => reset()}
            className='px-4 py-2 bg-yellow-600 text-sm text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'
          >
            {resetbuttonName}
          </button>
        )}
        {closebuttonName && (
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 bg-red-600 text-sm text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          >
            {closebuttonName}
          </button>
        )}
      </div>
    </form>
  );
};

export default DynamicFormBuilder;
