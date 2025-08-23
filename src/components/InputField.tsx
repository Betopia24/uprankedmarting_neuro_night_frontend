"use client";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
} & React.ComponentProps<"input">;

export default function InputField({
  label,
  name,
  placeholder,
  type = "text",
  className,
  required,
}: InputFieldProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0.5", className)}>
          <FormLabel className="flex justify-between items-center">
            <div className="flex items-center gap-2 justify-between">
              <span className="inline-flex items-center gap-1">
                {label}
                {required && (
                  <span className="text-destructive font-bold text-base leading-0">
                    *
                  </span>
                )}
              </span>
            </div>
          </FormLabel>
          <FormControl>
            <Input
              className="rounded-2xl placeholder:text-xs"
              {...field}
              placeholder={placeholder}
              type={type}
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
