"use client";

import { useAuth } from "@/components/AuthProvider";

export default function HubSpotConnectButton() {
  const { user } = useAuth();
  const orgId = user?.ownedOrganization?.id || "68c220255294a7faf37c168d";

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


//! try - 1

// "use client";

// import { useAuth } from "@/components/AuthProvider";
// import axios from "axios";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export default function HubSpotConnectButton() {
//   const { user, token } = useAuth();
//   const orgId = user?.ownedOrganization?.id || "";
//   const router = useRouter();

//   const handleConnect = async () => {
//     console.log("HubSpotConnectButton: orgId =", orgId); // Debug log
//     if (!token) {
//       toast.error("Please log in to connect HubSpot");
//       router.push("/auth/login");
//       return;
//     }
//     if (!orgId) {
//       toast.error("No organization found. Please create or select an organization.");
//       return;
//     }

//     try {
//       const res = await axios.get(`http://localhost:5000/api/v1/tools/hubspot/connect/${orgId}`, {
//         headers: { Authorization: token },
//       });
//       console.log("HubSpot OAuth URL:", res.data.data.authUrl); // Debug log
//       window.location.href = res.data.data.authUrl;
//     } catch (err: any) {
//       console.error("HubSpot connect error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Failed to initiate HubSpot connection");
//     }
//   };

//   return (
//     <button
//       onClick={handleConnect}
//       className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
//     >
//       Connect HubSpot
//     </button>
//   );
// }