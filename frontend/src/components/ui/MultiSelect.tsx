import React, { forwardRef } from "react";
import Select, { MultiValue, ActionMeta, SingleValue } from "react-select";

interface Option {
  label: string;
  value: string;
}
interface MultiSelectProps {
  name?: string;
  label?: string;
  options: Option[];
  error?: any;
  required?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[] | string) => void;
  onBlur?: () => void;
}

const MultiSelect = forwardRef<any, MultiSelectProps>(({
  name,
  label,
  options,
  error,
  required,
  disabled = false,
  isMulti = true,
  value,
  onChange,
  onBlur,
}, ref) => {
  const handleChange = (
    newValue: SingleValue<Option | any> | MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (onChange) {
      if (Array.isArray(newValue)) {
        const selectedValues = newValue.map((option) => option.value);
        onChange(selectedValues);
      } else if (!Array.isArray(newValue) && newValue) {
        onChange(newValue.value);
      } else {
        onChange([]);
      }
    }
  };

  console.log(value)
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        ref={ref}
        isMulti={isMulti}
        name={name}
        options={options}
        isDisabled={disabled}
        value={options.filter((option) => selectedValues.includes(option.value))} // Use selectedValues
        onChange={handleChange}
        onBlur={onBlur}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
