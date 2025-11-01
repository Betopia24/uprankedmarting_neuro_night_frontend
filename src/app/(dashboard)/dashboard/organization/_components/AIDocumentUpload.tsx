"use client";

import { useAuth } from "@/components/AuthProvider";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { useEffect, useState } from "react";
import DocumentUploads from "@/features/organization/DocumentUploads";
import { env } from "@/env";

export default function OrganizationDocumentUpload() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const res = await getSubscriptionType(token);
        const sub = res?.data;
        if (!sub || sub.status !== "ACTIVE") {
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center mt-10 text-red-500">No access token</div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading subscription...
      </div>
    );
  }

  const orgId = user?.ownedOrganization?.id || "";

  const AI_AGENT_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;

  const AI_AGENT_UPLOAD_URL = () =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/file`;
  const AI_AGENT_FETCH_URL = (organizationId: string) =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/${organizationId}`;
  const AI_AGENT_DELETE_URL = `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base`;

  return (
    <>
      <div className="space-y-10">
        <DocumentUploads
          organizationId={orgId}
          title="Upload Document for AI Agent"
          uploadUrl={AI_AGENT_UPLOAD_URL()}
          deleteUrl={AI_AGENT_DELETE_URL}
          fetchUrl={AI_AGENT_FETCH_URL(orgId)}
        />
      </div>
    </>
  );
}
