"use client";
import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  rating: number; // current rating
  size?: number; // star size (px)
  className?: string; // wrapper styles
  setRating?: (rating: number) => void; // callback for selection
};

export default function FeedbackRating({
  rating,
  size = 20,
  className,
  setRating,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const safe = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));

  return (
    <div
      className={`flex items-center gap-2 ${className ?? ""}`}
      aria-label={`${safe} out of 5 stars`}
      role="radiogroup"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const index = i + 1; // star number (1–5)
        const active = hover !== null ? index <= hover : index <= safe;
        const px = `${size}px`;

        return (
          <button
            key={i}
            type="button"
            onClick={() => setRating?.(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
            aria-label={`${index} star${index > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={active}
            className="relative inline-block cursor-pointer"
            style={{ width: px, height: px }}
          >
            <Star
              className={`absolute inset-0 ${
                active ? "text-yellow-500" : "text-gray-300"
              }`}
              width={size}
              height={size}
              fill={active ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
