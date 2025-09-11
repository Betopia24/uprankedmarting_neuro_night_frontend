"use client";

import SearchBar from "./SearchBar";
import Tabs from "./Tabs";
import AgentProfileCard from "./AgentProfileCard";
import { useEffect, useState } from "react";
import { AgentUser, StatusType } from "@/types/agent";

export default function AgentsList({
  users,
  statusParam,
  metadata,
}: {
  users: AgentUser[];
  statusParam: StatusType;
  metadata: { page: number; limit: number; total: number; totalPages: number };
}) {
  const [agents, setAgents] = useState(users);
  const [search, setSearch] = useState("");
  const filteredUsers = agents.filter((agent: AgentUser) => {
    return agent.name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    setAgents(users);
  }, [users]);

  const handleAgentUpdate = (agentId: string) => {
    setAgents((prevAgents) =>
      prevAgents.filter((agent) => agent.id !== agentId)
    );
  };

  // console.log("agents", agents);

  return (
    <div className="space-y-4">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="bg-gray-200 p-4 rounded-xl space-y-6">
        <Tabs selectedTab={statusParam} />
        {filteredUsers.length === 0 && (
          <p className="text-center">No agents found</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user: AgentUser) => (
            <AgentProfileCard
              key={user.id}
              user={user}
              status={statusParam}
              onAgentUpdate={handleAgentUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
