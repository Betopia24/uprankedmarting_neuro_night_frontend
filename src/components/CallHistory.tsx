"use client";

import React from "react";
import { useCall } from "@/contexts/CallContext";

const CallHistory: React.FC = () => {
  const { calls, fetchCallHistory, isLoading } = useCall(); // Add isLoading from context if available

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (duration: string | undefined) => {
    if (!duration) return "N/A";
    const seconds = parseInt(duration);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-800 bg-green-100";
      case "busy":
      case "no-answer":
        return "text-yellow-800 bg-yellow-100";
      case "failed":
      case "canceled":
        return "text-red-800 bg-red-100";
      case "in-progress":
      case "ringing":
      case "initiated":
        return "text-blue-800 bg-blue-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      const withoutCountry = cleaned.substring(1);
      return `+1 (${withoutCountry.slice(0, 3)}) ${withoutCountry.slice(
        3,
        6
      )}-${withoutCountry.slice(6)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return number;
  };

  // Handle undefined calls safely
  const isEmpty = !Array.isArray(calls) || calls.length === 0;

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchCallHistory}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Refresh
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading calls...</p>
        </div>
      ) : isEmpty ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No calls yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <div
              key={call.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPhoneNumber(call.to_number)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {call.started_at && formatDate(call.started_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      call.status
                    )}`}
                  >
                    {call.status}
                  </span>

                  {call.duration && (
                    <span className="text-sm text-gray-500">
                      {formatDuration(call.duration)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>From: {formatPhoneNumber(call.from_number)}</span>
                {call.ended_at && (
                  <span>Ended: {formatDate(call.ended_at)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More (if needed) */}
      {Array.isArray(calls) && calls.length >= 50 && (
        <div className="text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-500">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
