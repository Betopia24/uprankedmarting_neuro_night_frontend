import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { SelectItem } from "./ui/select";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectFieldProps {
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: Option[];
  required?: boolean;
  className?: string;
  error?: string[];
  placeholder?: string;
}

export default function CustomSelectField({
  label,
  value,
  defaultValue,
  onChange,
  options,
  required,
  className,
  error,
  placeholder = "Select an option",
}: CustomSelectFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {required ? (
            <span className="inline-flex items-center gap-1">
              {label}
              <span className="text-destructive font-bold text-base leading-0">
                *
              </span>
            </span>
          ) : (
            label
          )}
        </label>
      )}

      <Select value={value} onValueChange={onChange} defaultValue={defaultValue}>
        <SelectTrigger
          className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary flex justify-between items-center"
        >
          <SelectValue placeholder={placeholder} />
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </SelectTrigger>

        <SelectContent
          position="popper"
          className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="mt-1 text-sm text-red-500">{error.join(", ")}</p>}
    </div>
  );
}
