import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string[];
}

export default function FormField({ label, name, error, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error.join(", ")}</p>
      )}
    </div>
  );
}
