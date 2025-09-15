"use client";

import { Form } from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { FeedbackForm } from "./FeedbackForm";
import { Button, Heading } from "@/components";
import FeedbackRating from "./FeedbackRating";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";
import { toast } from "sonner";

// -----------------------------
// Types
// -----------------------------
interface FeedbackFormValues {
  message: string;
}

// Backend response type - made more specific
interface FeedbackResponse {
  success: boolean;
  message: string;
  // Add other expected response fields if any
  data?: unknown;
}

// Error response type for failed requests
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// Union type for all possible API responses
type ApiResponse = FeedbackResponse | ErrorResponse;

// Type guard to check if response is an error
function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return !response.success;
}

// Type for auth context - make it more specific if you know the exact shape
interface AuthContext {
  token: string;
  // Add other auth properties if needed
  user?: {
    id: string;
    email: string;
    // ... other user properties
  };
}

// -----------------------------
// Component
// -----------------------------
export default function ServiceFeedbackForm() {
  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      message: "",
    },
  });

  const [rating, setRating] = useState<number>(0);
  const auth = useAuth() as AuthContext | null; // Type assertion - adjust based on your AuthProvider

  const handleSubmit: SubmitHandler<FeedbackFormValues> = async (
    values
  ): Promise<void> => {
    // Enhanced auth validation
    if (
      !auth?.token ||
      typeof auth.token !== "string" ||
      auth.token.trim() === ""
    ) {
      toast.error("You must be logged in to submit feedback.");
      return;
    }

    // Validate rating
    if (rating <= 0 || rating > 5) {
      toast.error("Please provide a valid rating between 1 and 5.");
      return;
    }

    // Validate message
    if (!values.message.trim()) {
      toast.error("Please provide feedback message.");
      return;
    }

    try {
      // Ensure API_URL is defined
      if (!env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const requestBody = {
        feedbackText: values.message.trim(),
        rating: Number(rating),
      };

      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/service-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token, // Consider if you need "Bearer " prefix
        },
        body: JSON.stringify(requestBody),
      });

      // Type-safe response handling
      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response format from server");
      }

      // Check for HTTP errors first
      if (!res.ok) {
        const errorMessage =
          data.success === false
            ? data.message
            : `HTTP ${res.status}: ${res.statusText}`;
        toast.error(errorMessage);
        return;
      }

      // Check for API-level success
      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      // Success case
      toast.success(data.message);
      form.reset(); // reset the message field
      setRating(0); // reset rating to 0 instead of 4 for consistency
    } catch (err: unknown) {
      // Enhanced error handling with type safety
      let errorMessage = "An unexpected error occurred";

      if (err instanceof Error) {
        errorMessage = `Network error: ${err.message}`;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Feedback submission error:", err);
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FeedbackForm name="message" label="Service Feedback" />
        <div className="space-y-4 mt-4">
          <Heading size="h6" as="h3" weight="regular">
            Service Ratings
          </Heading>
          <FeedbackRating rating={rating} setRating={setRating} />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
