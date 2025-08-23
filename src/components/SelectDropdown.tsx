"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options: Option[];
  className?: string;
};

export default function SelectDropdown({
  label,
  name,
  placeholder = "Select an option",
  required,
  options,
  className,
}: SelectFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("border border-gray-300 gap-0", className)}>
          <FormLabel className="flex justify-between items-center border-b text-sm gap-2 p-1">
            <div className="flex items-center gap-2 p-1 justify-between">
              <span className="inline-flex items-center gap-2 font-medium text-base">
                {label}
                {required && (
                  <span className="text-destructive font-bold text-base leading-0">
                    *
                  </span>
                )}
              </span>
            </div>
          </FormLabel>
          <FormControl className="p-0">
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full border-transparent">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
