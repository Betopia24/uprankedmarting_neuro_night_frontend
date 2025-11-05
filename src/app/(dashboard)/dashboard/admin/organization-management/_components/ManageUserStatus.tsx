"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { Ban, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type UserStatus = string;

type ManageUserStatusProps = {
  userId: string;
  status: UserStatus;
};

export default function ManageUserStatus({
  userId,
  status,
}: ManageUserStatusProps) {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<UserStatus>("ACTIVE");
  const router = useRouter();

  const handleOpenDialog = (status: UserStatus) => {
    setActionType(status);
    setIsOpen(true);
  };

  const handleUpdateStatus = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/user-status/update/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ status: actionType }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        toast.success(
          json.message || `User ${actionType.toLowerCase()} successfully`
        );
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(json.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update user status");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleOpenDialog("BLOCKED")}
          className="gap-2"
          disabled={status === "BLOCKED"}
        >
          <Ban size={16} />
        </Button>

        <Button
          size="sm"
          variant="default"
          onClick={() => handleOpenDialog("ACTIVE")}
          className="gap-2"
          disabled={status === "ACTIVE"}
        >
          <ShieldCheck size={16} />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "BLOCKED" ? "Block User" : "Unblock User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "BLOCKED"
                ? "Are you sure you want to block this user? They will not be able to access the platform."
                : "Are you sure you want to unblock this user? They will regain access to the platform."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "BLOCKED" ? "destructive" : "default"}
              onClick={handleUpdateStatus}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : actionType === "BLOCKED"
                ? "Block User"
                : "Unblock User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </td>
  );
}
