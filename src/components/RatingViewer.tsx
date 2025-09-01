"use client";

import { Star } from "lucide-react";

interface RatingViewerProps {
  rating: number; // e.g. 3.25
  max?: number; // default 5
  size?: number; // star size (default 20)
}

export default function RatingViewer({
  rating,
  max = 5,
  size = 20,
}: RatingViewerProps) {
  const safeRating = Math.max(0, Math.min(rating, max));

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const diff = safeRating - i;

        let fillPercent = 0;
        if (diff >= 1) fillPercent = 1;
        else if (diff > 0) {
          if (diff <= 0.25) fillPercent = 0.25;
          else if (diff <= 0.5) fillPercent = 0.5;
          else if (diff <= 0.75) fillPercent = 0.75;
          else fillPercent = 1;
        }

        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
          >
            {/* Empty star outline */}
            <Star size={size} className="text-gray-300" />

            {/* Partial fill */}
            {fillPercent > 0 && (
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${fillPercent * 100}%` }}
              >
                <Star
                  size={size}
                  className="text-amber-400"
                  fill="currentColor"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
