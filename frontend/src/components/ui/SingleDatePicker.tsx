import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SingleDatePickerProps {
  name?: string;
  label?: string;
  error?: any;
  min?: any;
  max?: any;
  required?: boolean;
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  name,
  label,
  error,
  required,
  disabled,
  value,
  min,
  max,
  onChange,
  onBlur,
}) => {
  return (
    <div className='space-y-1'>
      <label htmlFor={name} className='block text-sm  font-medium text-gray-700'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <DatePicker
        id={name}
        name={name}
        selected={value}
        showYearDropdown={true}
        dateFormat='dd/MM/yyyy'
        disabled={disabled}
        onChange={onChange}
        minDate={min ?? null}
        maxDate={max ?? null}
        onBlur={onBlur}
        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      />
      {error && <p className='text-sm text-red-600'>{error.message}</p>}
    </div>
  );
};

export default SingleDatePicker;
