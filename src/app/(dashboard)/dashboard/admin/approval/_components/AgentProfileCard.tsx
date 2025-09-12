import Image from "next/image";
import { AgentUser, StatusType } from "@/types/agent";
import Heading from "@/components/Heading";
import RatingViewer from "@/components/RatingViewer";
import { AdminApprovalActionButtons } from "@/components/AgentButton";

export default function AgentProfileCard({
  user,
  status,
  onAgentUpdate,
}: {
  user: AgentUser;
  status: StatusType;
  onAgentUpdate: (agentId: string) => void;
}) {
  const userId = user.id;

  const approvalRequest = user.Agent.assignments.find((assignment) =>
    status === "approval" ? assignment.status === "PENDING" : ""
  );

  const removalRequest = user.Agent.assignments.find((assignment) =>
    status === "removal" ? assignment.status === "REMOVAL_REQUESTED" : ""
  );

  const newApprovalOrganizationId = approvalRequest?.organizationId;
  const newRemovalOrganizationId = removalRequest?.organizationId;

  const organizationInformation = approvalRequest || removalRequest;

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
          <Heading size="h4" as="h4" className="truncate px-4">
            {user.name}
          </Heading>
          <span className="text-xs text-black/70 leading-none capitalize truncate px-4">
            {user.Agent.skills.slice(0, 2).join(", ")}
          </span>
        </div>

        <div className="flex justify-center">
          <RatingViewer rating={user.Agent.avgRating} />
        </div>

        <p className="text-xs line-clamp-3">{user.bio || "No bio"}</p>

        <AdminApprovalActionButtons
          status={status}
          userId={userId}
          newApprovalOrganizationId={newApprovalOrganizationId || ""}
          newRemovalOrganizationId={newRemovalOrganizationId || ""}
          onAgentUpdate={onAgentUpdate}
        />

        <div className="flex flex-col gap-1 text-xs border-t border-t-gray-200 py-4 px-8">
          <strong>By</strong>
          <strong className="text-gray-500 block capitalize">
            {organizationInformation?.organization?.name}
          </strong>
          <span className="text-gray-500 block">
            {organizationInformation?.organization?.id}
          </span>
        </div>
      </div>
    </div>
  );
}
