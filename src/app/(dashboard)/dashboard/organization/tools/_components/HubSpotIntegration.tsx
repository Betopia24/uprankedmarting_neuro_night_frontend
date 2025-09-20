"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import HubSpotConnectButton from "./HubSpotConnectButton";

interface HubSpotStatus {
  isConnected: boolean;
  portalId?: string;
  accountName?: string;
  lastSyncedAt?: string;
}

interface HubSpotIntegrationProps {
  orgId: string;
  onBack: () => void;
}



const HubSpotIntegration: React.FC<HubSpotIntegrationProps> = ({
  orgId,
  onBack,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<HubSpotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  // ✅ Fetch HubSpot connection status
  const fetchStatus = async () => {
    const token = auth?.token;
    if (!token) {
      toast.error("Please log in to access HubSpot integration");
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`/api/tools/hubspot/status/${orgId}`, {
        headers: {
          Authorization: token,
        },
      });
      setStatus(res.data.data);
    } catch (err: any) {
      console.error("Fetch HubSpot status error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/auth/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch HubSpot status");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle HubSpot Connect
  const handleConnect = async () => {
    const token = auth?.token;
    if (!token) {
      toast.error("Please log in to connect HubSpot");
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/tools/hubspot/connect/${orgId}`, {
        headers: {
          Authorization: token,
        },
      });
      // backend থেকে authUrl পাঠাবে
      window.location.href = res.data.data.authUrl;
    } catch (err: any) {
      console.error("HubSpot connect error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to initiate HubSpot connection");
      setLoading(false);
    }
  };

  // ✅ Handle HubSpot Disconnect
  const handleDisconnect = async () => {
    const token = auth?.token;
    if (!token) {
      toast.error("Please log in to disconnect HubSpot");
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/tools/hubspot/disconnect/${orgId}`, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("HubSpot disconnected successfully");
      setStatus(null);
      await fetchStatus();
    } catch (err: any) {
      console.error("HubSpot disconnect error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to disconnect HubSpot");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle OAuth callback query parameters
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (success === "hubspot_connected") {
      toast.success("HubSpot connected successfully!");
      fetchStatus();
      router.replace("/dashboard/organization/tools", { scroll: false });
    } else if (error && message) {
      toast.error(decodeURIComponent(message) || "HubSpot connection failed");
      router.replace("/dashboard/organization/tools", { scroll: false });
    }
  }, [searchParams, router]);

  // ✅ Fetch status on component mount
  useEffect(() => {
    if (orgId) {
      fetchStatus();
    }
  }, [orgId]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
      >
        <span>←</span> Back to Tools
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        HubSpot Integration
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {status?.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 rounded-md">
                <p className="text-green-800 font-medium">
                  Connected to HubSpot
                </p>
                {status.accountName && (
                  <p className="text-sm text-gray-700">
                    Account: {status.accountName}
                  </p>
                )}
                {status.lastSyncedAt && (
                  <p className="text-sm text-gray-600">
                    Last synced: {new Date(status.lastSyncedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Disconnect HubSpot
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Connect your HubSpot to sync leads automatically.
              </p>
              {/* <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Connect HubSpot
              </button> */}
              <HubSpotConnectButton />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HubSpotIntegration;
