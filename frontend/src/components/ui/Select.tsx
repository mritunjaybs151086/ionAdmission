import React, { forwardRef } from "react";

interface SelectProps {
  name?: string;
  label?: string;
  options: { label: string; value: string }[];
  error?: any;
  disabled?: boolean;
  value?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, label, options, error, required, onChange, disabled = false, value, onBlur }, ref) => {
    return (
      <div className='space-y-1'>
        <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
        <select
          id={name}
          name={name}
          ref={ref} // Attach the ref here
          required={required}
          disabled={disabled}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        >
          <option value=''>Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className='text-sm text-red-600'>{error.message}</p>}
      </div>
    );
  },
);

export default Select;
