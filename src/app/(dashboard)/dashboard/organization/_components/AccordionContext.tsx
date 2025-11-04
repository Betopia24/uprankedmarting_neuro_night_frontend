"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AccordionContextType {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within AccordionProvider");
  }
  return context;
};

interface AccordionProviderProps {
  children: ReactNode;
  defaultOpenId?: string | null;
}

export const AccordionProvider: React.FC<AccordionProviderProps> = ({
  children,
  defaultOpenId = null,
}) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      {children}
    </AccordionContext.Provider>
  );
};
