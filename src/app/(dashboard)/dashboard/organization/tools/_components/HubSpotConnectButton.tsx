"use client";

import { useAuth } from "@/components/AuthProvider";

export default function HubSpotConnectButton() {
  const { user } = useAuth();
  const orgId = user?.ownedOrganization?.id || "";

  const handleConnect = () => {
    // const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID!;
    // const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URI!);

    const scopes = encodeURIComponent(
      "oauth crm.schemas.custom.read crm.objects.custom.read crm.objects.custom.write"
    );

    const url = `https://app-na2.hubspot.com/oauth/authorize?client_id=a39e0394-1a64-416d-956c-de2f77678db0&redirect_uri=http://localhost:5000/api/v1/tools/hubspot/callback&scope=oauth&optional_scope=crm.schemas.custom.read%20crm.objects.custom.read%20crm.objects.custom.write&state=${orgId}`;

    window.location.href = url;
  };

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
    >
      Connect HubSpot
    </button>
  );
}
