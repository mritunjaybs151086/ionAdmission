import React, { forwardRef } from "react";

interface TextInputProps {
  name?: string;
  label?: string;
  error?: any;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  min?: number;
  max?: number;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      label,
      error,
      type = "text",
      value,
      disabled = false,
      min,
      max,
      placeholder,
      required,
      onChange,
      onBlur,
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={name}
          name={name}
          value={value ?? ''}
          type={type}
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          ref={ref}  // Attach the ref here
          onChange={onChange}
          onBlur={onBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
);

export default TextInput;
