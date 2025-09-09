"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import RatingViewer from "@/components/RatingViewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { env } from "@/env";
import Image from "next/image";
import { Button, Heading } from "@/components";
import { LucideTrash2 } from "lucide-react";

type Mode = "agent" | "service";

interface Client {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface Feedback {
  id: string;
  clientId: string;
  rating: number;
  feedbackText: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
}

interface RatingStats {
  averageRating: number;
  ratingPercentages: Record<string, number>; // keys: "1"-"5"
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: {
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: T[];
    ratingStats?: RatingStats;
  };
}

const CONFIG = {
  agent: {
    get: () => `${env.NEXT_PUBLIC_API_URL}/agent-feedback`,
    delete: (id: string) => `${env.NEXT_PUBLIC_API_URL}/agent-feedback/${id}`,
  },
  service: {
    get: () => `${env.NEXT_PUBLIC_API_URL}/service-feedback`,
    delete: (id: string) => `${env.NEXT_PUBLIC_API_URL}/service-feedback/${id}`,
  },
};

export default function ShowFeedback() {
  const [selected, setSelected] = useState<Mode>("agent");
  const auth = useAuth();
  const token = auth?.token;
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ratingStat, setRatingStat] = useState<RatingStats>({
    averageRating: 0,
    ratingPercentages: {},
  });

  const getFeedbackUrl = () => CONFIG[selected].get();

  useEffect(() => {
    if (!token) return;

    const fetchFeedbacks = async () => {
      try {
        setError(null);
        const res = await fetch(getFeedbackUrl(), {
          headers: { Authorization: token },
        });
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);

        const json: ApiResponse<Feedback> = await res.json();
        setFeedbacks(json.data?.data ?? []);
        setRatingStat(
          json.data?.ratingStats ?? { averageRating: 0, ratingPercentages: {} }
        );
      } catch (err) {
        setError((err as Error).message);
        setFeedbacks([]);
        setRatingStat({ averageRating: 0, ratingPercentages: {} });
      }
    };

    fetchFeedbacks();
  }, [selected, token]);

  return (
    <div className="p-4">
      <FeedBackMode selected={selected} setSelected={setSelected} />
      <div className="flex flex-col md:flex-row gap-4">
        <FeedbackStat averageRating={ratingStat.averageRating} />
        <RatingGraph ratingPercentages={ratingStat.ratingPercentages} />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Review reviews={feedbacks} setReviews={setFeedbacks} mode={selected} />
    </div>
  );
}

// Mode selector
export function FeedBackMode({
  selected,
  setSelected,
}: {
  selected: Mode;
  setSelected: (mode: Mode) => void;
}) {
  return (
    <div className="sticky top-4 mb-4">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full border-0 shadow-none font-semibold text-lg">
          <SelectValue placeholder="Feedback" />
        </SelectTrigger>
        <SelectContent position="popper" className="z-50">
          <SelectItem value="agent">Agent Feedback</SelectItem>
          <SelectItem value="service">Service Feedback</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Average rating card
function FeedbackStat({ averageRating }: { averageRating: number }) {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-3xl aspect-square max-w-40 flex flex-col items-center justify-center gap-2">
      <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
      <RatingViewer rating={averageRating} size={24} />
      <span>Total Ratings</span>
    </div>
  );
}

// Rating graph for 5→1 stars
function RatingGraph({
  ratingPercentages,
}: {
  ratingPercentages: Record<string, number>;
}) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const percent = ratingPercentages[star] ?? 0;
        return (
          <div key={star} className="flex items-center gap-2">
            <div className="w-6 text-right text-sm rotate-[-35deg]">{star}</div>
            <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span className="w-12 text-sm text-right">
              {percent.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Review list
function Review({
  reviews,
  setReviews,
  mode,
}: {
  reviews: Feedback[];
  setReviews: React.Dispatch<React.SetStateAction<Feedback[]>>;
  mode: Mode;
}) {
  const token = useAuth()?.token;

  if (!reviews.length)
    return <p className="text-gray-500 p-2">No {mode} feedback yet.</p>;

  const deleteUrl = (id: string) => CONFIG[mode].delete(id);

  const handleDelete = async (id: string) => {
    if (!token) return;
    const prevReviews = [...reviews];
    setReviews((current) => current.filter((r) => r.id !== id));

    try {
      const res = await fetch(deleteUrl(id), {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
    } catch {
      setReviews(prevReviews);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-2 border rounded shadow flex gap-4 items-center hover:bg-red-50"
        >
          <div className="shrink-0">
            {review.client.image ? (
              <Image
                src={review.client.image}
                alt={review.client.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                {review.client.name[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col text-xs">
            <span className="font-semibold">{review.client.name}</span>
            <span>
              {review.feedbackText.slice(0, 50)}
              {review.feedbackText.length > 50 && "..."}
            </span>
            <RatingViewer rating={review.rating} size={12} />
          </div>
          <Button
            onClick={() => handleDelete(review.id)}
            variant="secondary"
            size="icon"
            className="shrink-0 hover:bg-rose-400"
          >
            <LucideTrash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}
