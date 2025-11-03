"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function AssignedAgentButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isShowingAssigned = searchParams.get("assigned") === "true";

  const handleAssignedAgents = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      // If "assigned" exists in URL, remove it. Otherwise, add it with "true"
      if (params.get("assigned")) {
        params.delete("assigned");
      } else {
        params.set("assigned", "true");
      }

      // Navigate to the new URL
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Button disabled={isPending} onClick={handleAssignedAgents}>
      {isPending
        ? "Loading..."
        : isShowingAssigned
        ? "Hide assigned agents"
        : "Show assigned agents"}
    </Button>
  );
}
