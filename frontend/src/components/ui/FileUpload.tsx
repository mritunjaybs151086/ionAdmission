import React, { forwardRef } from "react";

// Define a custom validation for file types
const fileValidation = (file: File) => {
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
    "text/csv", // CSV
  ];
  return validTypes.includes(file.type);
};

interface FileUploadComponentProps {
  name?: string;
  label?: string;
  error?: any;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  onFileAccepted?: (file: File) => void; // Callback to handle accepted file
  onChange?: (file: File) => void; 
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FileUploadComponent = forwardRef<HTMLInputElement, FileUploadComponentProps>(
  (
    {
      name,
      label,
      error,
      accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      disabled = false,
      required = false,
      onFileAccepted,
      onChange,
      onBlur,
    },
    ref
  ) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate the file type
        if (!fileValidation(file)) {
          console.error("Invalid file type. Please upload a CSV or Excel file.");
          return;
        }
        // Proceed with file processing
        console.log("File accepted:", file);
        onFileAccepted?.(file); // Call the onFileAccepted callback with the accepted file if it's defined
        onChange?.(file); // Call the onChange callback with the event if it's defined
      }
    };

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          required={required}
          ref={ref}  // Attach the ref here
          onChange={handleFileChange}
          onBlur={onBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
);

export default FileUploadComponent;
