import AudioUploadRecorder from "@/components/audio/AudioManager";

import { getMe } from "@/lib/auth";

export default async function VoiceUploadPage() {
  const me = await getMe();
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
