"use client";

import { ReactNode } from "react";
import { useAccordion } from "./AccordionContext";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  id: string;
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  className = "",
}) => {
  const { openId, setOpenId } = useAccordion();
  const isOpen = openId === id;

  const handleToggle = () => {
    setOpenId(isOpen ? null : id);
  };

  return (
    <div className={`border border-gray-200 rounded-lg mb-2 ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};
