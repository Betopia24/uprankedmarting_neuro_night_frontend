"use client";

import { AgentUser } from "../page";
import SearchBar from "./SearchBar";
import Tabs from "./Tabs";
import AgentProfileCard from "./AgentProfileCard";
import { useState } from "react";

export default function AgentsList({ users, viewParam }: any) {
  const [search, setSearch] = useState("");
  const filteredUsers = users.filter((user: AgentUser) => {
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="bg-gray-200 p-4 rounded-xl space-y-6">
        <Tabs selectedTab={viewParam} />
        {filteredUsers.length === 0 && (
          <p className="text-center">No agents found</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user: AgentUser) => (
            <AgentProfileCard
              key={user.id}
              user={user}
              isSelected={viewParam === "my-agents"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
