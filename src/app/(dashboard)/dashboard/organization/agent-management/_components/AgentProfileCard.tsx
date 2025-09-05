import Image from "next/image";
import { AgentUser } from "../page";
import Heading from "@/components/Heading";
import RatingViewer from "@/components/RatingViewer";
import Button from "@/components/Button";

export default function AgentProfileCard({
  user,
  isSelected,
}: {
  user: AgentUser;
  isSelected: boolean;
}) {
  return (
    <div className="bg-white rounded shadow-xl p-4 overflow-hidden">
      <div className="max-w-84 mx-auto space-y-3 text-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto"
            width={96}
            height={96}
          />
        ) : (
          <div className="size-24 border border-gray-400 rounded-full mx-auto flex items-center justify-center text-4xl font-semibold">
            {user.name.slice(0, 1)}
          </div>
        )}

        <div>
          <Heading size="h4" as="h4">
            {user.name}
          </Heading>
          <span className="text-xs text-black/70 leading-none capitalize truncate">
            {user.Agent.skills.slice(0, 2).join(", ")}
          </span>
        </div>

        <div className="flex justify-center">
          <RatingViewer rating={user.Agent.avgRating} />
        </div>

        <p className="text-xs">{user.bio}</p>

        <div className="text-center">
          {!isSelected ? (
            <Button size="sm">Select</Button>
          ) : (
            <Button size="sm" className="bg-yellow-500 px-8">
              Remove
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between flex-wrap border-t border-t-gray-200 py-4 px-8">
          <Stats
            progress={user.Agent.AgentFeedbacks.length}
            label="Feedbacks"
          />
          <Stats progress={user.Agent.totalCalls} label="Total Calls" />
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Stats
// -----------------------------

function Stats({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="flex flex-col text-center">
      <span className="text-base font-semibold">{progress}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}
