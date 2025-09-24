"use client";

import SearchBar from "./SearchBar";
import Tabs from "./Tabs";
import AgentProfileCard from "./AgentProfileCard";
import { useState } from "react";
import { RemoveAgentButton, SelectAgentButton } from "@/components/AgentButton";
import { AgentUser, ViewType } from "@/types/agent";
import { useAuth } from "@/components/AuthProvider";

interface AgentsListProps {
  users: AgentUser[];
  viewParam: ViewType;
  onTabChange: (tab: ViewType) => void;
  metadata: { page: number; limit: number; total: number; totalPages: number };
  loading?: boolean;
  error?: string | null;
}

export default function AgentsList({
  users,
  viewParam,
  onTabChange,
  metadata,
  loading = false,
  error = null,
}: AgentsListProps) {
  const auth = useAuth();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user: AgentUser) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SearchBar search={search} setSearch={setSearch} />

      <div className="bg-gray-200 p-4 rounded-xl space-y-6">
        <Tabs selectedTab={viewParam} onTabChange={onTabChange} />

        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading agents...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-4">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center mt-4">No agents found</p>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {!loading &&
            filteredUsers.map((user: AgentUser) => {
              const approveInformation =
                user.Agent?.assignments?.filter(
                  (assignment) => assignment.status === "PENDING"
                ) || [];

              const approveInformationOrgId =
                approveInformation[0]?.organizationId;

              const approvalPending =
                approveInformation.length === 1 &&
                approveInformationOrgId === auth.user?.id;

              const removalPending =
                user.Agent?.assignments?.filter(
                  (assignment) => assignment.status === "REMOVAL_REQUESTED"
                )?.length === 1;

              return (
                <AgentProfileCard
                  key={user.id}
                  user={user}
                  action={
                    viewParam === "my-agents" ? (
                      <RemoveAgentButton
                        agentId={user.id}
                        pending={removalPending}
                      >
                        {removalPending ? "Pending" : "Remove"}
                      </RemoveAgentButton>
                    ) : (
                      <SelectAgentButton
                        agentId={user.id}
                        pending={approvalPending}
                      >
                        {approvalPending ? "Pending" : "Select"}
                      </SelectAgentButton>
                    )
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
