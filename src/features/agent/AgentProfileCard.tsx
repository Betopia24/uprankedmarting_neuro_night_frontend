import { Button, Heading } from "@/components";
import RatingViewer from "@/components/RatingViewer";

type ProfileCardProps = {
  picked?: boolean;
};

export default function AgentProfileCard({ picked = false }: ProfileCardProps) {
  return (
    <div className="bg-white rounded shadow-xl p-4">
      <div className="max-w-84 mx-auto space-y-3 text-center">
        <div className="size-24 border rounded-full mx-auto"></div>
        <div className="">
          <Heading size="h4" as="h4">
            Imtiaj Howlader
          </Heading>
          <span className="text-xs text-black/70">Marketing</span>
        </div>
        <div className="flex justify-center">
          <RatingViewer rating={4.9} />
        </div>
        <p className="text-xs">
          UI is the saddle, the stirrups, & the reins. UX is the feeling you get
          being a
        </p>
        <div className="text-center">
          {picked ? (
            <Button size="sm">Select</Button>
          ) : (
            <Button size="sm" className="bg-yellow-500 px-8">
              Remove
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between flex-wrap border-t border-t-gray-200 py-4 px-8">
          <Stats progress={5055} label="Organization" />
          <Stats progress={8974} label="Handle Call" />
        </div>
      </div>
    </div>
  );
}

function Stats({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="flex flex-col text-center">
      <span className="text-base font-semibold">{progress}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}
