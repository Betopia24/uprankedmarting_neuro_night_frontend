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
  defaultValue?: string;
};

export default function SelectField({
  label,
  name,
  placeholder = "Select an option",
  required,
  options,
  className,
  defaultValue,
}: SelectFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0.5", className)}>
          <FormLabel>
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
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || defaultValue}
              value={field.value || defaultValue}
            >
              <SelectTrigger className="rounded-2xl w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent position="popper">
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
