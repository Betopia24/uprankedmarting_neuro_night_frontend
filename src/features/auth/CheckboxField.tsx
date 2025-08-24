"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useId } from "react";
type CheckboxFieldProps = {
  name: string;
  label: React.ReactNode;
} & React.ComponentProps<"input">;

function CheckboxComponent({
  name,
  id,
  className,
}: React.ComponentProps<"input">) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name as string}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormControl>
            <Checkbox
              id={id}
              checked={value}
              onCheckedChange={(checked) => onChange(checked)}
              className={cn("border-primary", className)}
            />
          </FormControl>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
}

export default function CheckboxField({
  name,
  label,
  className,
}: CheckboxFieldProps) {
  const id = useId();
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center space-x-2">
        <CheckboxComponent className="cursor-pointer" id={id} name={name} />
        <Label className="text-gray-600 text-xs" htmlFor={id}>
          {label}
        </Label>
      </div>
    </div>
  );
}
