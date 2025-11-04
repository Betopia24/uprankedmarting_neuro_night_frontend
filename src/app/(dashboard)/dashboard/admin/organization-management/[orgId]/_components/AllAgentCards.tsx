"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Star } from "lucide-react";
import { env } from "@/env";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface AgentCardData {
  id: string;
  name: string;
  employeeId: string;
  successCalls: number;
  droppedCalls: number;
  performance: string;
  title?: string;
  description?: string;
  isAssigned: boolean;
}

interface AgentCardsProps {
  agents: AgentCardData[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  orgId: string;
}

export default function AgentCards({
  agents,
  currentPage,
  totalPages,
  basePath,
  orgId,
}: AgentCardsProps) {
  const router = useRouter();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentCardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handlePageChange = (page: number) => {
    router.push(`${basePath}?page=${page}`);
  };

  const handleAssign = (agent: AgentCardData) => {
    setSelectedAgent(agent);
    setShowAssignModal(true);
  };

  const handleRemove = (agent: AgentCardData) => {
    setSelectedAgent(agent);
    setShowRemoveModal(true);
  };

  const cancelAssign = () => {
    setShowAssignModal(false);
    setSelectedAgent(null);
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedAgent(null);
  };

  const confirmAssign = async () => {
    if (!selectedAgent) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/agents/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token as string,
        },
        body: JSON.stringify({
          agentUserId: selectedAgent.id,
          organizationId: orgId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error assigning agent:", err);
    } finally {
      setIsLoading(false);
      setShowAssignModal(false);
      setSelectedAgent(null);
    }
  };

  const confirmRemove = async () => {
    if (!selectedAgent) return;
    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      const res = await fetch(`/api/organizations/${orgId}/agents/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent.id }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        console.error("Failed to remove agent");
      }
    } catch (err) {
      console.error("Error removing agent:", err);
    } finally {
      setIsLoading(false);
      setShowRemoveModal(false);
      setSelectedAgent(null);
    }
  };

  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {agent.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{agent.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {agent.employeeId}
                </p>

                {/* Star Rating (based on performance) */}
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => {
                    const performanceScore = parseInt(agent.performance);
                    const stars = Math.round((performanceScore / 100) * 5);
                    return (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
                  {agent.description}
                </p>

                {/* Stats */}
                <div className="flex justify-around mb-4 py-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Success</p>
                    <p className="text-lg font-semibold text-green-600">
                      {agent.successCalls}
                    </p>
                  </div>
                  <div className="w-px bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Dropped</p>
                    <p className="text-lg font-semibold text-red-600">
                      {agent.droppedCalls}
                    </p>
                  </div>
                  <div className="w-px bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Performance</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {agent.performance}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {agent.isAssigned ? (
                    <>
                      <button className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md font-medium cursor-not-allowed opacity-60">
                        Assign
                      </button>
                      <button
                        onClick={() => handleRemove(agent)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAssign(agent)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                      >
                        Assign
                      </button>
                      {/* <button className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md font-medium cursor-not-allowed opacity-60">
                        Remove
                      </button> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-gray-500">
            No agents found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to assign{" "}
              <span className="font-semibold">{selectedAgent?.name}</span> to
              this organization?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={cancelAssign} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={confirmAssign}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Assigning..." : "Confirm Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Modal */}
      <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{selectedAgent?.name}</span> from
              this organization?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={cancelRemove} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={confirmRemove}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Removing..." : "Confirm Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
