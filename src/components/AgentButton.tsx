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
  pending = false,
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

    setIsPending(true); // optimistic update

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
        setIsPending(false); // revert on error
        throw new Error(data?.message || "Failed to send request.");
      }

      toast.success("Agent request sent successfully!");
      router.refresh();
      return data;
    } catch (error: unknown) {
      setIsPending(false); // revert
      console.error("Agent selection error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center",
        isPending && "opacity-70 cursor-wait"
      )}
    >
      {isPending && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent border-b-transparent rounded-full animate-spin mr-2" />
      )}
      {isPending ? "Pending" : children}
    </Button>
  );
}

export function RemoveAgentButton({
  children,
  agentId,
  pending = false,
}: RemoveAgentButtonProps) {
  const auth = useAuth();
  const token = auth?.token;
  const router = useRouter();
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

    setIsPending(true); // optimistic update

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
        setIsPending(false); // revert
        throw new Error(data?.message || "Failed to request agent removal.");
      }

      toast.success("Agent removal request sent successfully!");
      router.refresh();
      return data;
    } catch (error: unknown) {
      setIsPending(false); // revert
      console.error("Agent removal error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "bg-orange-500 hover:bg-orange-500/80 flex items-center justify-center",
        isPending && "opacity-70 cursor-wait"
      )}
    >
      {isPending && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent border-b-transparent rounded-full animate-spin mr-2" />
      )}
      {isPending ? "Pending" : children}
    </Button>
  );
}

const adminEndpoint = {
  approval: {
    accept: () => "agents/approve-agent-assignment",
    reject: () => "agents/reject-agent-assignment",
  },
  removal: {
    accept: () => `agents/approve-agent-removal`,
    reject: () => `agents/reject-agent-removal`,
  },
};

export function AdminApprovalActionButtons({
  status,
  userId,
  newApprovalOrganizationId,
  newRemovalOrganizationId,
  onAgentUpdate,
}: {
  status: "approval" | "removal";
  userId: string;
  newApprovalOrganizationId: string;
  newRemovalOrganizationId: string;
  onAgentUpdate: (agentId: string) => void;
}) {
  const auth = useAuth();
  const [isProcessing, setIsProcessing] = useState<"accept" | "reject" | null>(
    null
  );

  const organizationId = newApprovalOrganizationId || newRemovalOrganizationId;
  const approvalEndpoint = adminEndpoint[status].accept;
  const removalEndpoint = adminEndpoint[status].reject;

  const handleAction = async (action: "accept" | "reject") => {
    setIsProcessing(action);

    const endpoint =
      action === "accept" ? approvalEndpoint() : removalEndpoint();

    await toast.promise(
      fetch(`${env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth?.token}`,
        },
        body: JSON.stringify({ userId, organizationId }),
      }).then((res) => {
        if (!res.ok) throw new Error("Request failed");
        onAgentUpdate(userId);
      }),
      {
        loading: action === "accept" ? "Approving..." : "Rejecting...",
        success:
          action === "accept"
            ? "Approved successfully!"
            : "Rejected successfully!",
        error: action === "accept" ? "Failed to approve." : "Failed to reject.",
      }
    );

    setIsProcessing(null);
  };

  return (
    <div className="flex gap-2 justify-center">
      <Button
        size="sm"
        disabled={isProcessing !== null}
        onClick={() => handleAction("accept")}
      >
        {isProcessing === "accept" ? "Approving..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={isProcessing !== null}
        onClick={() => handleAction("reject")}
      >
        {isProcessing === "reject" ? "Ignoring..." : "Ignore"}
      </Button>
    </div>
  );
}
