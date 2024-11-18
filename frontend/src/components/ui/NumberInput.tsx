import React, { forwardRef } from "react";

interface NumberInputProps {
  name?: string;
  label?: string;
  error?: any;
  disabled?: boolean;
  required?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// Use forwardRef to forward refs to the input element
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  name,
  label,
  error,
  required,
  value,
  disabled = false,
  onChange,
  onBlur,
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(e.target.value));
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        value={value ? value : '0'}
        onChange={handleChange}
        onBlur={onBlur}
        ref={ref} // Attach the ref here
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
});

// Set a display name for easier debugging
NumberInput.displayName = "NumberInput";

export default NumberInput;
