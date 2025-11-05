"use client";

import { useAuth } from "@/components/AuthProvider";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import DocumentUploads from "@/features/organization/DocumentUploads";
import HumanDocumentUploads from "@/features/organization/HumanDocumentUpload/HumanDocumentUploads";
import { env } from "@/env";

export default function OrganizationDocumentUploadPageClient() {
  const { token, user } = useAuth();
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSubscriptionType(token);
        const sub = res?.data[0];
        if (sub && (sub.status === "ACTIVE" || sub.status === "TRIALING")) {
          setSubscription(sub);
        } else {
          setError("No active subscription found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  console.log({ subscription });

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

  if (error || !subscription) {
    return (
      <div
        style={{ height: "calc(100vh - var(--_sidebar-header-height))" }}
        className="flex flex-col items-center justify-center bg-gray-50 px-4 text-center -mt-20"
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700 mb-6">
            {error || "Your current plan does not allow uploading documents."}
          </p>
          <Button variant="link" className="mt-4">
            <a href="/dashboard/organization/explore-numbers">
              Upgrade your plan
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const orgId = user?.ownedOrganization?.id || "";

  const AI_AGENT_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;
  const HUMAN_AGENT_BASE_URL = env.NEXT_PUBLIC_API_URL;

  const AI_AGENT_UPLOAD_URL = () =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/file`;
  const AI_AGENT_FETCH_URL = (organizationId: string) =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/${organizationId}`;
  const AI_AGENT_DELETE_URL = `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base`;

  const HUMAN_AGENT_UPLOAD_URL = () => `${HUMAN_AGENT_BASE_URL}/company-docs`;
  const HUMAN_AGENT_LIST_URL = () =>
    `${HUMAN_AGENT_BASE_URL}/company-docs/organization`;
  const HUMAN_AGENT_DELETE_FILE = () => `${HUMAN_AGENT_BASE_URL}/company-docs`;

  return (
    <>
      {subscription.planLevel === "only_real_agent" && (
        <div className="space-y-10">
          <HumanDocumentUploads
            organizationId={orgId}
            title="Upload Document for Human Agent"
            uploadUrl={HUMAN_AGENT_UPLOAD_URL()}
            deleteUrl={HUMAN_AGENT_DELETE_FILE()}
            fetchUrl={HUMAN_AGENT_LIST_URL()}
          />
        </div>
      )}

      {subscription.planLevel === "only_ai" && (
        <div className="space-y-10">
          <DocumentUploads
            organizationId={orgId}
            title="Upload Document for AI Agent"
            uploadUrl={AI_AGENT_UPLOAD_URL()}
            deleteUrl={AI_AGENT_DELETE_URL}
            fetchUrl={AI_AGENT_FETCH_URL(orgId)}
          />
        </div>
      )}

      {subscription.planLevel === "ai_then_real_agent" && (
        <div className="space-y-10">
          <DocumentUploads
            organizationId={orgId}
            title="Upload Document for AI Agent"
            uploadUrl={AI_AGENT_UPLOAD_URL()}
            deleteUrl={AI_AGENT_DELETE_URL}
            fetchUrl={AI_AGENT_FETCH_URL(orgId)}
          />
          <HumanDocumentUploads
            organizationId={orgId}
            title="Upload Document for Human Agent"
            uploadUrl={HUMAN_AGENT_UPLOAD_URL()}
            deleteUrl={HUMAN_AGENT_DELETE_FILE()}
            fetchUrl={HUMAN_AGENT_LIST_URL()}
          />
        </div>
      )}
    </>
  );
}
