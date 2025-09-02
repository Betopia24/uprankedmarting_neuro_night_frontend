"use client";

import AudioUploadRecorder from "@/components/audio/AudioManager";
import { useAuth } from "@/components/AuthProvider";

export default function VoiceUploadPage() {
  const me = useAuth();
  const AI_AGENT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_AI;
  const uploadUrl = `${AI_AGENT_BASE_URL}/organization-voice/organization`;

  return (
    <AudioUploadRecorder
      uploadUrl={uploadUrl}
      organizationId={me?.organizationInfo?.id || ""}
    />
  );
}
