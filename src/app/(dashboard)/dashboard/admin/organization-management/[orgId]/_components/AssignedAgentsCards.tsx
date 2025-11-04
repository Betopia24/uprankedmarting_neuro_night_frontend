"use client";

import React, { useState, useEffect } from "react";
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

interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  status: string;
}

interface AgentCardData {
  id: string;
  userId: string;
  employeeId: string;
  successCalls: number;
  droppedCalls: number;
  phone_number: string;
  status: string;
  skills: string[];
  user: AgentUser;
}

interface AssignedAgentsProps {
  orgId: string;
  currentPage?: number;
  basePath?: string;
}

export default function AssignedAgentsCards({
  orgId,
  currentPage = 1,
  basePath = "",
}: AssignedAgentsProps) {
  const router = useRouter();
  const [agents, setAgents] = useState<AgentCardData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentCardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingData(true);
      try {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/agents/organization/${orgId}?page=${currentPage}`,
          {
            headers: {
              Authorization: token as string,
            },
          }
        );

        if (res.ok) {
          const response = await res.json();
          // Navigate the nested structure: data.data.data and data.data.meta
          const agentsData = response?.data?.data || [];
          const meta = response?.data?.data?.meta || {};

          setAgents(agentsData);
          setTotalPages(meta.totalPages || 1);
        } else {
          toast.error("Failed to fetch agents");
          setAgents([]);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
        toast.error("Error loading agents");
        setAgents([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (token && orgId) {
      fetchAgents();
    }
  }, [orgId, currentPage, token]);

  const handlePageChange = (page: number) => {
    router.push(`${basePath}?page=${page}`);
  };

  const handleRemove = (agent: AgentCardData) => {
    setSelectedAgent(agent);
    setShowRemoveModal(true);
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedAgent(null);
  };

  const confirmRemove = async () => {
    if (!selectedAgent) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/agents/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token as string,
        },
        body: JSON.stringify({
          agentUserId: selectedAgent.user.id,
          organizationId: orgId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Agent removed successfully");
        // Remove agent from local state
        setAgents((prev) => prev.filter((a) => a.id !== selectedAgent.id));
        router.refresh();
      } else {
        toast.error(data.message || "Failed to remove agent");
      }
    } catch (err) {
      console.error("Error removing agent:", err);
      toast.error("Error removing agent");
    } finally {
      setIsLoading(false);
      setShowRemoveModal(false);
      setSelectedAgent(null);
      router.refresh();
    }
  };

  // Calculate performance percentage (can be customized based on your logic)
  const calculatePerformance = (successCalls: number, droppedCalls: number) => {
    const total = successCalls + droppedCalls;
    if (total === 0) return 0;
    return Math.round((successCalls / total) * 100);
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-500">Loading agents...</div>
      </div>
    );
  }

  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length > 0 ? (
          agents.map((agent) => {
            const performance = calculatePerformance(
              agent.successCalls,
              agent.droppedCalls
            );
            const stars = Math.round((performance / 100) * 5);

            return (
              <div
                key={agent.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {agent.user.image ? (
                      <img
                        src={agent.user.image}
                        alt={agent.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {agent.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {agent.user.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {agent.employeeId}
                  </p>

                  {/* Star Rating (based on performance) */}
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {agent.skills.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{agent.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

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
                        {performance}%
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3 text-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        agent.status === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {agent.status.charAt(0).toUpperCase() +
                        agent.status.slice(1)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(agent)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Remove Agent
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-gray-500">
            No assigned agents found.
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

      {/* Remove Modal */}
      <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{selectedAgent?.user.name}</span>{" "}
              from this organization? This action cannot be undone.
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
