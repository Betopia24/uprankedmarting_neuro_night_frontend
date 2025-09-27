"use client";

import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { env } from "@/env";

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: { success: boolean; message: string } =
        await response.json();

      if (!result.success)
        throw new Error(result.message || "Failed to send message");

      toast.success(result.message || "Message sent successfully!");
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const renderError = (error: FieldError | undefined) => {
    return error?.message ? (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    ) : null;
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white p-8 rounded-lg shadow space-y-6"
        >
          {/* Name */}
          <div>
            <Label className="mb-2" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Your Name"
            />
            {renderError(errors.name)}
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              placeholder="your@email.com"
            />
            {renderError(errors.email)}
          </div>

          {/* Message */}
          <div>
            <Label className="mb-2" htmlFor="message">
              Message
            </Label>
            <Textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              placeholder="Your message..."
              rows={6}
            />
            {renderError(errors.message)}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
