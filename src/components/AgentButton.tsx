"use client";

import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type WithChildren = React.PropsWithChildren;
type SelectAgentButtonProps = WithChildren & {
  agentId: string;
  pending: boolean;
};
type RemoveAgentButtonProps = WithChildren & {
  agentId: string;
  pending: boolean;
};

export function SelectAgentButton({
  children,
  agentId,
  pending,
}: SelectAgentButtonProps) {
  const auth = useAuth();
  const token = auth?.token;
  const router = useRouter();
  const [isPending, setIsPending] = useState(pending);

  const handleClick = async () => {
    if (isPending) {
      toast.error("Agent request is already pending.");
      return;
    }
    if (!token) {
      toast.error("You must be logged in to select an agent.");
      return;
    }

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/agents/request/${agentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to send request.");
      }

      // 🔑 Optimistic update
      setIsPending(true);

      toast.success("Agent request sent successfully!");
      router.refresh(); // re-fetch server data
      return data;
    } catch (error: unknown) {
      console.error("Agent selection error:", error);
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <Button size="sm" onClick={handleClick} disabled={isPending}>
      {isPending ? "Pending" : children}
    </Button>
  );
}

export function RemoveAgentButton({
  children,
  agentId,
  pending,
}: RemoveAgentButtonProps) {
  const auth = useAuth();
  const token = auth?.token;
  const [isPending, setIsPending] = useState(pending);

  const handleClick = async () => {
    if (isPending) {
      toast.error("Agent removal request is already pending.");
      return;
    }
    if (!token) {
      toast.error("You must be logged in to remove an agent.");
      return;
    }

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/agents/${agentId}/request-agent-removal`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to request agent removal.");
      }

      // 🔑 Optimistic update
      setIsPending(true);

      toast.success("Agent removal request sent successfully!");
      return data;
    } catch (error: unknown) {
      console.error("Agent removal error:", error);
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      className={cn("bg-orange-500 hover:bg-orange-500/80")}
      disabled={isPending}
    >
      {isPending ? "Pending" : children}
    </Button>
  );
}

const adminEndpoint = {
  approval: {
    accept: (agentId: string) => "agents/approve-agent-assignment",
    reject: (agentId: string) => "agents/reject",
  },
  removal: {
    accept: (agentId: string) => `agents/${agentId}/approve-agent-removal`,
    reject: (agentId: string) => `agents/${agentId}/reject-agent-removal`,
  },
};

export function AdminApprovalActionButtons({
  status,
  userId,
  agentId,
}: {
  status: "approval" | "removal";
  userId: string;
  agentId: string;
}) {
  const auth = useAuth();
  const approvalEndpoint = adminEndpoint[status].accept;
  const removalEndpoint = adminEndpoint[status].reject;

  const handleApprovalAction = async () => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/${approvalEndpoint(userId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth?.token}`,
          },
          body: JSON.stringify({ userId, organizationId: agentId }),
        }
      );
    } catch (error) {}
  };

  return (
    <div className="flex gap-2 justify-center">
      <Button onClick={handleApprovalAction} size="sm">
        Approve
      </Button>
      <Button variant="destructive" size="sm">
        Reject
      </Button>
    </div>
  );
}
