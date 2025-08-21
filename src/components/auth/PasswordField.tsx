"use client";
import TextField from "./TextField";
import { Button } from "@/components/ui/button";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { useState } from "react";

type PasswordFieldProps = {
  label: string;
} & React.ComponentProps<"input">;

export default function PasswordField({
  label,
  name,
  type,
  placeholder,
}: PasswordFieldProps) {
  const [toggleInputType, setToggleInputType] = useState(false);
  return (
    <TextField
      label={label}
      name={name as string}
      type={toggleInputType ? "text" : type}
      placeholder={placeholder}
    >
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute right-0 bottom-0 rounded-br-2xl rounded-tr-2xl"
        onClick={() => setToggleInputType(!toggleInputType)}
      >
        {toggleInputType ? <LucideEyeOff /> : <LucideEye />}
      </Button>
    </TextField>
  );
}
