"use client";

import SearchBar from "./SearchBar";
import Tabs from "./Tabs";
import AgentProfileCard from "./AgentProfileCard";
import { useState } from "react";
import { RemoveAgentButton, SelectAgentButton } from "@/components/AgentButton";
import { AgentUser, ViewType } from "@/types/agent";

export default function AgentsList({
  users,
  viewParam,
  metadata,
}: {
  users: AgentUser[];
  viewParam: ViewType;
  metadata: { page: number; limit: number; total: number; totalPages: number };
}) {
  const [search, setSearch] = useState("");
  const filteredUsers = users.filter((user: AgentUser) => {
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  console.log("filteredUsers", filteredUsers);

  return (
    <div className="space-y-4">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="bg-gray-200 p-4 rounded-xl space-y-6">
        <Tabs selectedTab={viewParam} />
        {filteredUsers.length === 0 && (
          <p className="text-center">No agents found</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user: AgentUser) => {
            const approvalPending =
              user.Agent.assignments.filter((assignment) => {
                return assignment.status === "PENDING";
              }).length === 1;

            const removalPending =
              user.Agent.assignments.filter((assignment) => {
                return assignment.status === "REMOVAL_REQUESTED";
              }).length === 1;
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
