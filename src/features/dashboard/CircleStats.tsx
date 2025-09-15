"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  max: number;
  color: string;
};

export default function CircleStats({ value, max, color }: Props) {
  return (
    <div className="relative inline-flex max-w-32">
      <svg
        className="block size-full relative rotate-[-90deg]" // rotate so it starts from top
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r="22"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <Circle value={value} max={max} color={color} />
      </svg>

      {/* Center label */}
      <div className="absolute z-10 font-bold inset-0 flex items-center justify-center text-xl text-blue-600">
        {value}
      </div>
    </div>
  );
}

function Circle({ value, max, color }: Props) {
  const ref = useRef<SVGCircleElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const circle = ref.current;
    if (!circle) return;

    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    const progress = Math.min(value / max, 1); // clamp 0..1
    const targetOffset = circumference * (1 - progress);

    requestAnimationFrame(() => {
      setOffset(targetOffset);
    });
  }, [value, max]);

  return (
    <circle
      ref={ref}
      cx="25"
      cy="25"
      r="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeDashoffset={offset}
      strokeLinecap="round"
      className="transition-all duration-1000 ease-out rotate-90 origin-center"
      style={{
        stroke: color,
      }}
    />
  );
}
