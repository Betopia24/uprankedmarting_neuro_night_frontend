"use client";

import { ChevronDown, Star } from "lucide-react";

type Review = {
  id: string;
  name: string;
  time: string;
  rating: number;
  comment: string;
};

const DISTRIBUTION: Array<{ stars: 1 | 2 | 3 | 4 | 5; percent: number }> = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 62 },
  { stars: 3, percent: 37 },
  { stars: 2, percent: 18 },
  { stars: 1, percent: 9 },
];

const REVIEWS: Review[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `rev-${i + 1}`,
  name: "Nateshnda Cathy",
  time: "2h ago",
  rating: 5,
  comment: "I’m satisfied with the support I received.",
}));

export default function FeedbackPanel({
  title = "Customer Feedback",
  rating = 4.8,
  totalRatings = 2005,
}: {
  title?: string;
  rating?: number;
  totalRatings?: number;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        <ChevronDown className="h-5 w-5 text-neutral-400" aria-hidden="true" />
      </div>

      {/* Blue rating card */}
      <div className="mb-6 rounded-2xl bg-gray-500 p-5 text-white">
        <div className="text-center">
          <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
          <div className="mt-2 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(rating) ? "text-yellow-300" : "text-white/80"
                }`}
                fill="currentColor"
                stroke="currentColor"
              />
            ))}
          </div>
          <div className="mt-2 text-sm text-white/90">
            {totalRatings.toLocaleString()} Ratings
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="mb-6 space-y-3">
        {DISTRIBUTION.map((row) => (
          <div key={row.stars} className="flex items-center gap-3">
            <span className="w-3 text-right text-xs text-neutral-700">
              {row.stars}
            </span>
            <Star
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              stroke="currentColor"
            />
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                style={{ width: `${row.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
        {REVIEWS.map((r) => (
          <article key={r.id} className="flex items-start gap-3 p-3 text-sm">
            <img
              src="/rounded-user-avatar.png"
              alt={`Avatar of ${r.name}`}
              className="h-8 w-8 flex-none rounded-full border border-neutral-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-medium text-neutral-900">
                  {r.name}
                </h3>
                <span className="text-xs text-neutral-500">{r.time}</span>
              </div>
              <div className="mt-1 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 text-yellow-400"
                    fill={i < r.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                  />
                ))}
              </div>
              <p className="mt-1 line-clamp-2 text-neutral-600">{r.comment}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
