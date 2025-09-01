import { Button } from "@/components";
import AgentProfileCard from "./AgentProfileCard";
import { LucideSearch } from "lucide-react";

export default function AgentList() {
  return (
    <div className="mt-6 space-y-10 max-w-6xlx mx-auto">
      <div className="border inline-flex gap-1 focus-within:text-blue-500 items-center px-2 py-1 rounded-md focus-within:border-blue-500">
        <LucideSearch className="text-current" />
        <input
          placeholder="Search by Agent Name"
          className="focus:ring-0 outline-none text-black"
        />
      </div>
      <Wrapper>
        <Tabs />
        <AgentListWrapper>
          <AgentProfileCard />
          <AgentProfileCard />
          <AgentProfileCard />
          <AgentProfileCard />
          <AgentProfileCard />
          <AgentProfileCard />
          <AgentProfileCard />
        </AgentListWrapper>
      </Wrapper>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren) {
  return <div className="bg-gray-200 p-4 rounded-xl space-y-6">{children}</div>;
}

function AgentListWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

function Tabs() {
  return (
    <div>
      <Button variant="secondary" size="sm" className="rounded-none">
        View Agent List
      </Button>
      <Button variant="secondary" size="sm" className="rounded-none">
        View My Agent List
      </Button>
    </div>
  );
}
