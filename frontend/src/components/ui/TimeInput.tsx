import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimePickerComponentProps {
  name?: string;
  label?: string;
  error?: any;
  disabled?: boolean;
  required?: boolean;
  value?: Date;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
}

const TimePickerComponent: React.FC<TimePickerComponentProps> = ({
  name,
  label,
  error,
  required,
  value,
  disabled = false,
  onChange,
  onBlur,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <DatePicker
        id={name}
        name={name}
        selected={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default TimePickerComponent;