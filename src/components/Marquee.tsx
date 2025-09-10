"use client";

export default function Marquee({ children }: React.PropsWithChildren) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute z-10 left-0 top-0 inset-y-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute z-10 right-0 top-0 inset-y-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
