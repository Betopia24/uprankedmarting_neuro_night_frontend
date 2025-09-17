'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

interface GoogleSheetsStatus {
  isConnected: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  lastSyncedAt?: string;
}

interface GoogleSheetsIntegrationProps {
  orgId: string;
  onBack: () => void;
}

const GoogleSheetsIntegration: React.FC<GoogleSheetsIntegrationProps> = ({
  orgId,
  onBack,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<GoogleSheetsStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Google Sheets connection status
  const fetchStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to access Google Sheets integration');
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/tools/google-sheets/status/${orgId}`,
        {
          headers: {
            Authorization: token, // raw token
          },
        }
      );
      setStatus(response.data.data);
    } catch (error: any) {
      console.error('Fetch status error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to fetch Google Sheets status'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sheets connection
  const handleConnect = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to connect Google Sheets');
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/tools/google-sheets/connect/${orgId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      window.location.href = response.data.data.authUrl;
    } catch (error: any) {
      console.error('Connect error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        toast.error(
          error.response?.data?.message ||
          'Failed to initiate Google Sheets connection'
        );
      }
      setLoading(false);
    }
  };

  // Handle Google Sheets disconnection
  const handleDisconnect = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to disconnect Google Sheets');
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/tools/google-sheets/disconnect/${orgId}`, {
        headers: {
          Authorization: token,
        },
      });
      toast.success('Google Sheets disconnected successfully');
      setStatus(null);
      await fetchStatus();
    } catch (error: any) {
      console.error('Disconnect error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to disconnect Google Sheets'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth callback query parameters
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    const spreadsheetUrl = searchParams.get('spreadsheetUrl');

    if (success === 'google_sheets_connected' && spreadsheetUrl) {
      toast.success('Google Sheets connected successfully!');
      setStatus({
        isConnected: true,
        spreadsheetUrl,
      });
      fetchStatus();
      router.replace('/dashboard/organization/tools', { scroll: false });
    } else if (error && message) {
      toast.error(decodeURIComponent(message) || 'Google Sheets connection failed');
      router.replace('/dashboard/organization/tools', { scroll: false });
    }
  }, [searchParams, router]);

  // Fetch status on component mount
  useEffect(() => {
    if (orgId) {
      fetchStatus();
    }
  }, [orgId]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* ✅ Back button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
      >
        <span>←</span> Back to Tools
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Google Sheets Integration
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
                  Connected to Google Sheets
                </p>
                {status.spreadsheetUrl && (
                  <a
                    href={status.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Spreadsheet
                  </a>
                )}
                {status.lastSyncedAt && (
                  <p className="text-sm text-gray-600">
                    Last synced:{' '}
                    {new Date(status.lastSyncedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Disconnect Google Sheets
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Connect your Google Sheets to sync Q&A pairs automatically.
              </p>
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Connect Google Sheets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsIntegration;
