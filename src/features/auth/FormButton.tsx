"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/Button";

interface FormButtonProps {
  pendingText: string;
  children: React.ReactNode;
}

export default function FormButton({ pendingText, children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" className="w-full" type="submit" aria-disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
