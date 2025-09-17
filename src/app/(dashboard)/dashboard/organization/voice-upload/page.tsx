// import AudioUploadRecorder from "@/components/audio/AudioManager";

// import { getMe } from "@/lib/auth";

// export default async function VoiceUploadPage() {
//   const me = await getMe();
//   const AI_AGENT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_AI;
//   const uploadUrl = `${AI_AGENT_BASE_URL}/organization-voice/organization`;
//   return (
//     me &&
//     me?.ownedOrganization?.id && (
//       <AudioUploadRecorder
//         uploadUrl={uploadUrl}
//         organizationId={me.ownedOrganization.id}
//       />
//     )
//   );
// }

//! Try - 1

import { getSubscriptionType } from "@/app/api/subscription/subscription";
import AudioUploadRecorder from "@/components/audio/AudioManager";
import { Button } from "@/components/ui/button";
import { getMe, getServerAuth } from "@/lib/auth";

export default async function VoiceUploadPage() {
  const me = await getMe();
  const auth = await getServerAuth();
  const subscriptionRes = await getSubscriptionType(auth?.accessToken || "");
  const subscription = subscriptionRes?.data;

  if (
    subscription.planLevel === "only_real_agent" || !subscription
  ) {
    return (
      <div
        style={{
          height: "calc(100vh - var(--_sidebar-header-height))",
        }}
        className="flex flex-col items-center justify-center  bg-gray-50 px-4 text-center -mt-20"
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700 mb-6">Your current plan does not allow uploading documents for Voice Upload</p>
          <Button variant="link" className="mt-4">
            <a href="/dashboard/organization/explore-numbers">
              Upgrade your plan
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const AI_AGENT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_AI;
  const uploadUrl = `${AI_AGENT_BASE_URL}/organization-voice/organization`;

  return (
    me &&
    me?.ownedOrganization?.id && (
      <AudioUploadRecorder
        uploadUrl={uploadUrl}
        organizationId={me.ownedOrganization.id}
      />
    )
  );
}
