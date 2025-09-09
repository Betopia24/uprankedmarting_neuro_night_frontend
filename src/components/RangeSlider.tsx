"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type RangeSliderProps = {
  label?: string;
  name: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  defaultValue?: number;
};

export default function RangeSlider({
  label,
  name,
  required,
  min = 0,
  max = 100,
  step = 1,
  className,
  defaultValue,
}: RangeSliderProps) {
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
            <Slider
              min={min}
              max={max}
              step={step}
              value={[field.value ?? defaultValue ?? min]}
              onValueChange={(val) => field.onChange(val[0])}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
