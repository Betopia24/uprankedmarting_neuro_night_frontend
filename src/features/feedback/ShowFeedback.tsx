"use client";

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
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Heading } from "@/components";
import { LucideTrash2 } from "lucide-react";

type Mode = "agent" | "service";

interface Feedback {
  id: string;
  feedbackText: string;
  rating?: number;
  createdAt?: string;
  client: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };

    data: T[];
  };
}

const CONFIG = {
  agent: {
    get: () => `${env.NEXT_PUBLIC_API_URL}/agent-feedback`,
    delete: (agentId: string) =>
      `${env.NEXT_PUBLIC_API_URL}/agent-feedback/${agentId}`,
  },
  service: {
    get: () => `${env.NEXT_PUBLIC_API_URL}/service-feedback`,
    delete: (serviceId: string) =>
      `${env.NEXT_PUBLIC_API_URL}/service-feedback/${serviceId}`,
  },
};

export default function ShowFeedback() {
  const [selected, setSelected] = useState<Mode>("agent");
  const auth = useAuth();
  const token = auth?.token;
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{ averageRating: number }>();

  const getFeedbackUrl = () => CONFIG[selected].get();

  useEffect(() => {
    if (!token) return;

    const fetchFeedbacks = async () => {
      try {
        setError(null);

        const res = await fetch(getFeedbackUrl(), {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed with status ${res.status}`);
        }

        const json: ApiResponse<Feedback> = await res.json();
        console.log(json);

        setFeedbacks(json?.data?.data ?? []);
      } catch (err) {
        setError((err as Error).message);
        setFeedbacks([]);
      } finally {
      }
    };

    fetchFeedbacks();
  }, [selected, token]);

  return (
    <div className="p-4">
      <FeedBackMode selected={selected} setSelected={setSelected} />
      <FeedbackStat averageRating={2} />
      {error && <p className="text-red-500">Error: {error}</p>}
      <Review
        key={selected}
        mode={selected}
        reviews={feedbacks}
        setReviews={setFeedbacks}
      />
    </div>
  );
}

export function FeedBackMode({
  selected,
  setSelected,
}: {
  selected: Mode;
  setSelected: (selected: Mode) => void;
}) {
  return (
    <div className="sticky top-4">
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

function FeedbackStat({ averageRating }: { averageRating: number }) {
  return (
    <div className="p-4">
      <div className="bg-blue-500 text-white rounded-3xl aspect-square max-w-40 mx-auto flex flex-col gap-1 items-center justify-center">
        <span className="text-2xl font-bold">{averageRating}</span>
        <RatingViewer rating={3} size={24} />
        <span>2005 Rating</span>
      </div>
    </div>
  );
}

function Review({
  mode,
  reviews,
  setReviews,
}: {
  mode: Mode;
  reviews: Feedback[];
  setReviews: React.Dispatch<React.SetStateAction<Feedback[]>>;
}) {
  const token = useAuth()?.token;

  if (!reviews.length) {
    return <p className="text-gray-500 p-2">No {mode} feedback yet.</p>;
  }

  const deleteUrl = (id: string) => CONFIG[mode].delete(id);

  const handleDelete = async (id: string) => {
    if (!token) return;
    const prevReviews = reviews;
    setReviews((current) => current.filter((r) => r.id !== id));

    try {
      const res = await fetch(deleteUrl(id), {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
    } catch (err) {
      setReviews(prevReviews);
    }
  };

  return (
    <div className="-mx-1">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="px-2 py-2 border border-gray-200 rounded shadow-lg mb-1 cursor-pointer hover:bg-red-50"
        >
          <div className="flex justify-between items-center gap-4">
            <div className="shrink-0">
              {review.client.image ? (
                <Image
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                  src={review?.client?.image}
                  alt={review.client.name}
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                  {review.client.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>

            <div className="text-xs flex flex-col flex-1">
              <span className="font-semibold">{review.client.name}</span>
              <span>{review.feedbackText.slice(0, 24)}...</span>
              <RatingViewer size={10} rating={review.rating || 0} />
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
        </div>
      ))}
    </div>
  );
}
