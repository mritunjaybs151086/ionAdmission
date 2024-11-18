import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  name?: string;
  label?: string;
  error?: any;
  min?:any;
  required?: boolean;
  value?: [Date | null, Date | null];
  onChange?: (dates: [Date | null, Date | null]) => void;
  onBlur?: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  name,
  label,
  error,
  min,
  required,
  value,
  onChange,
  onBlur,
}) => {
  const [startDate, endDate] = value || [null, null];

  const handleChange = (dates: [Date | null, Date | null]) => {
    onChange?.(dates);
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <DatePicker
        selectsRange={true}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        minDate={min || undefined}
        onChange={handleChange}
        onBlur={onBlur}
        monthsShown={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        dateFormat="dd/MM/yyyy"
        placeholderText="Select date range"
        isClearable={true}
        showYearDropdown={true}
        showPopperArrow={false}
        required={required}
        id={name}
        name={name}
      />
      {error && <p className="text-sm text-red-600" role="alert">{error.message}</p>}
    </div>
  );
};

export default DateRangePicker;