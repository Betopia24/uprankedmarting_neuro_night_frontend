"use client";

import { useAuth } from "@/components/AuthProvider";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import DocumentUploads from "@/features/organization/DocumentUploads";
import HumanDocumentUploads from "@/features/organization/HumanDocumentUpload/HumanDocumentUploads";
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

  const HUMAN_AGENT_BASE_URL = env.NEXT_PUBLIC_API_URL;
  const HUMAN_AGENT_UPLOAD_URL = () => `${HUMAN_AGENT_BASE_URL}/company-docs`;
  const HUMAN_AGENT_LIST_URL = () =>
    `${HUMAN_AGENT_BASE_URL}/company-docs/organization`;
  const HUMAN_AGENT_DELETE_FILE = () => `${HUMAN_AGENT_BASE_URL}/company-docs`;

  return (
    <>
      <div className="space-y-10">
        <HumanDocumentUploads
          organizationId={orgId}
          title="Upload Document for Human Agent"
          uploadUrl={HUMAN_AGENT_UPLOAD_URL()}
          deleteUrl={HUMAN_AGENT_DELETE_FILE()}
          fetchUrl={HUMAN_AGENT_LIST_URL()}
        />
      </div>
    </>
  );
}
