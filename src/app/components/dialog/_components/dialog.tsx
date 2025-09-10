"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode, forwardRef } from "react";
import { X } from "lucide-react";

// ========== Trigger ==========
function Trigger({ children }: { children: ReactNode }) {
  return <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>;
}

// ========== Content ==========
const Content = forwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-gray-950/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          className={`fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none ${className}`}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md text-gray-500 hover:text-gray-800 focus:outline-none">
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);
Content.displayName = "Dialog.Content";

// ========== Title ==========
function Title({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Title
      className={`text-lg font-semibold text-gray-900 ${className}`}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

// ========== Description ==========
function Description({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Description
      className={`text-sm text-gray-500 mt-2 ${className}`}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

// ========== Footer ==========
function Footer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-6 flex justify-end gap-2 ${className}`}>{children}</div>
  );
}

// ========== Compound Dialog ==========
const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger,
  Content,
  Title,
  Description,
  Footer,
});

export { Dialog };
