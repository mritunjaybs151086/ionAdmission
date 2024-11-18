import React from "react";

interface CheckboxProps {
  name?: string;
  label?: string;
  error?: any;
  required?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  error,
  required,
  checked,
  onChange,
  disabled,
  onBlur,
}) => {
  return (
    <div className="space-y-1">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name={name}
          required={required}
          disabled={disabled}
          checked={checked}
          value={checked ? "true" : "false"}
          onChange={onChange}
          onBlur={onBlur}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      </label>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default Checkbox;