"use client";

import SearchBar from "./SearchBar";
import Tabs from "./Tabs";
import AgentProfileCard from "./AgentProfileCard";
import { useState } from "react";
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
  const [search, setSearch] = useState("");
  const filteredUsers = users
    .filter((user: AgentUser) => {
      return user.name.toLowerCase().includes(search.toLowerCase());
    })
    .filter((user: AgentUser) => {
      return user.Agent?.assignments[0]?.status !== "REJECTED";
    });

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
            <AgentProfileCard key={user.id} user={user} status={statusParam} />
          ))}
        </div>
      </div>
    </div>
  );
}
