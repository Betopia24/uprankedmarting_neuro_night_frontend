"use client";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type TextFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
} & React.ComponentProps<"input">;

export function FeedbackForm({
  label,
  name,
  placeholder,
  className,
  required,
}: TextFieldProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-.5", className)}>
          <FormLabel className="text-lg">
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
            <Textarea
              {...field}
              placeholder={placeholder}
              className={cn("min-h-40 bg-zinc-100 shadow-xs")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
