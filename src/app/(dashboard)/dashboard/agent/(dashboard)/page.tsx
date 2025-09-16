"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useCall } from "@/contexts/CallContext";
import CallPanel from "@/components/CallPanel";
import CallHistory from "@/components/CallHistory";
// import OutboundDialer from '@/app/components/OutboundDialer';
import TwilioInboundAgent from "@/components/TwilioClient";

const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { isDeviceReady, currentCall, callStatus } = useCall();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "outbound" | "inbound"
  >("profile");
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [currentCallInfo, setCurrentCallInfo] = useState<{
    toNumber: string;
    fromNumber: string;
    callSid?: string;
  } | null>(null);

  console.log({ user });

  useEffect(() => {
    console.log("🏠 Dashboard - Auth state:", {
      isLoading,
      user: user ? user.name : "No user",
    });
    if (!isLoading && !user) {
      console.log("❌ No user found and not loading, redirecting to login");
      router.push("/login");
    } else if (user) {
      console.log("✅ User found, staying on dashboard");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCallInitiated = (toNumber: string, fromNumber: string) => {
    setIsCallInProgress(true);
    setCurrentCallInfo({ toNumber, fromNumber });
    console.log("📞 Call initiated from", fromNumber, "to:", toNumber);
  };

  const handleCallEnded = () => {
    setIsCallInProgress(false);
    setCurrentCallInfo(null);
    console.log("📞 Call ended");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500";
      case "connecting":
      case "ringing":
        return "bg-yellow-500";
      case "connected":
        return "bg-blue-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready";
      case "connecting":
        return "Connecting...";
      case "ringing":
        return "Ringing...";
      case "connected":
        return "In Call";
      case "error":
        return "Error";
      case "incoming":
        return "Incoming Call";
      default:
        return "Initializing...";
    }
  };

  // Tab navigation component
  const TabButton = ({
    id,
    label,
    active,
  }: {
    id: "profile" | "outbound" | "inbound";
    label: string;
    active: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Outbound Call Center
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600">Agent: {user.name}</p>
                  {user.Agent?.sip_username && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      SIP: {user.Agent.sip_username}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    callStatus
                  )}`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {getStatusText(callStatus)}
                </span>
              </div>

              {/* Agent Availability */}
              {user.Agent && (
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.Agent.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.Agent.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              )}

              {/* Agent Stats */}
              {user.Agent && (
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                  <span>Total Calls: {user.Agent.totalCalls || 0}</span>
                  <span>Success: {user.Agent.successCalls || 0}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation (only for agents) */}
        {user.Agent && (
          <div className="mb-8">
            <nav className="flex space-x-2 bg-white p-2 rounded-lg shadow">
              <TabButton
                id="profile"
                label="Profile"
                active={activeTab === "profile"}
              />
              <TabButton
                id="outbound"
                label="Outbound Calls"
                active={activeTab === "outbound"}
              />
              <TabButton
                id="inbound"
                label="Inbound Calls"
                active={activeTab === "inbound"}
              />
            </nav>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {user.role}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.phone || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Verification Status
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Information */}
            {user.Agent && (
              <>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Agent Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Job Title
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user.Agent.jobTitle}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Department
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user.Agent.department}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Status
                        </dt>
                        <dd className="mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.Agent.status === "online"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.Agent.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          SIP Username
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">
                          {user.Agent.sip_username || "N/A"}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Performance Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Performance Summary
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {user.Agent.totalCalls || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Calls</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {user.Agent.successCalls || 0}
                        </div>
                        <div className="text-sm text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {user.Agent.droppedCalls || 0}
                        </div>
                        <div className="text-sm text-gray-600">Dropped</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {user.Agent.totalCalls > 0
                            ? Math.round(
                                ((user.Agent.successCalls || 0) /
                                  user.Agent.totalCalls) *
                                  100
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Outbound Calls Tab */}
        {activeTab === "outbound" && user.Agent && (
          <div className="space-y-6">
            {/* Current Call Status Bar */}
            {currentCall && (
              <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Call in Progress
                      </p>
                      <p className="text-xs text-blue-600">
                        {currentCall.parameters?.To ||
                          currentCallInfo?.toNumber ||
                          "Unknown Number"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-800">
                    {getStatusText(callStatus)}
                  </div>
                </div>
              </div>
            )}

            {/* Device Not Ready Warning */}
            {!isDeviceReady && callStatus !== "ready" && (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Call Service Initializing
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Please wait while we connect to the call service...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Call Panel and Outbound Dialer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Make Outbound Call
                </h2>
              </div>
              <div className="p-6">
                <div className="flex justify-center">
                  {/* <OutboundDialer
                    agentId={user.id}
                    onCallInitiated={handleCallInitiated}
                    isCallInProgress={isCallInProgress}
                    onEndCall={handleCallEnded}
                  /> */}
                </div>
                <div className="mt-6">
                  <CallPanel />
                </div>
                {/* Current Call Info */}
                {isCallInProgress && currentCallInfo && (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Current Call
                    </h4>
                    <div className="text-sm text-blue-800">
                      <div>From: {currentCallInfo.fromNumber}</div>
                      <div>To: {currentCallInfo.toNumber}</div>
                      {currentCallInfo.callSid && (
                        <div>Call ID: {currentCallInfo.callSid}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Call History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Calls
                </h2>
              </div>
              <div className="p-6">
                <CallHistory />
              </div>
            </div>
          </div>
        )}

        {/* Inbound Calls Tab */}
        {activeTab === "inbound" && user.Agent && user.Agent.sip_username && (
          <div className="space-y-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Inbound Call Interface
                </h3>
                <TwilioInboundAgent identity={user.Agent.sip_username} />
              </div>
            </div>
          </div>
        )}

        {/* Non-Agent Message */}
        {!user.Agent && activeTab !== "profile" && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">
                  Agent Access Required
                </h3>
                <p>
                  Your account is not configured as an agent. Please contact
                  your administrator for agent access.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/contexts/AuthContext'
// import TwilioInboundAgent from '@/app/components/TwilioClient'
// import OutboundDialer from '@/app/components/OutboundDialer' // Import the organization-aware component

// export default function DashboardPage() {
//   const { user, isLoading, logout } = useAuth();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<'profile' | 'outbound' | 'inbound'>('profile')
//   const [isCallInProgress, setIsCallInProgress] = useState(false)
//   const [currentCall, setCurrentCall] = useState<{
//     toNumber: string
//     fromNumber: string
//     callSid?: string
//   } | null>(null)

//   useEffect(() => {
//     console.log('🏠 Dashboard page - Auth state:', {
//       isLoading,
//       user: user ? user.name : 'No user'
//     });
//     if (!isLoading && !user) {
//       console.log('❌ No user found and not loading, redirecting to login');
//       router.push('/login');
//     } else if (user) {
//       console.log('✅ User found, staying on dashboard');
//     }
//   }, [user, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//   };

//   const handleCallInitiated = (toNumber: string, fromNumber: string) => {
//     setIsCallInProgress(true)
//     setCurrentCall({ toNumber, fromNumber })
//     console.log('📞 Call initiated from', fromNumber, 'to:', toNumber)
//   }

//   const handleCallEnded = () => {
//     setIsCallInProgress(false)
//     setCurrentCall(null)
//     console.log('📞 Call ended')
//   }

//   // Tab navigation component
//   const TabButton = ({
//     id,
//     label,
//     active
//   }: {
//     id: 'profile' | 'outbound' | 'inbound',
//     label: string,
//     active: boolean
//   }) => (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors ${
//         active
//           ? 'bg-blue-600 text-white'
//           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//       }`}
//     >
//       {label}
//     </button>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//             <div className="flex items-center space-x-4">
//               <div className="text-sm text-gray-600">
//                 Welcome, {user.name}
//               </div>
//               {user.Agent && (
//                 <div className="flex items-center space-x-2">
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       user.Agent.isAvailable
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {user.Agent.isAvailable ? 'Available' : 'Unavailable'}
//                   </span>
//                 </div>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">

//           {/* Tab Navigation (only show for agents) */}
//           {user.Agent && (
//             <div className="mb-8">
//               <nav className="flex space-x-2 bg-white p-2 rounded-lg shadow">
//                 <TabButton id="profile" label="Profile" active={activeTab === 'profile'} />
//                 <TabButton id="outbound" label="Outbound Calls" active={activeTab === 'outbound'} />
//                 <TabButton id="inbound" label="Inbound Calls" active={activeTab === 'inbound'} />
//               </nav>
//             </div>
//           )}

//           {/* Profile Tab */}
//           {activeTab === 'profile' && (
//             <div className="space-y-6">
//               {/* User Profile Card */}
//               <div className="bg-white overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                     Profile Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Name</dt>
//                       <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Email</dt>
//                       <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Role</dt>
//                       <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Phone</dt>
//                       <dd className="mt-1 text-sm text-gray-900">{user.phone || 'N/A'}</dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
//                       <dd className="mt-1">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             user.isVerified
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                         >
//                           {user.isVerified ? 'Verified' : 'Not Verified'}
//                         </span>
//                       </dd>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Agent Information */}
//               {user.Agent && (
//                 <>
//                   <div className="bg-white overflow-hidden shadow rounded-lg">
//                     <div className="px-4 py-5 sm:p-6">
//                       <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                         Agent Information
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Job Title</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{user.Agent.jobTitle}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Department</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{user.Agent.department}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Status</dt>
//                           <dd className="mt-1">
//                             <span
//                               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                 user.Agent.status === 'online'
//                                   ? 'bg-green-100 text-green-800'
//                                   : 'bg-gray-100 text-gray-800'
//                               }`}
//                             >
//                               {user.Agent.status}
//                             </span>
//                           </dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">SIP Username</dt>
//                           <dd className="mt-1 text-sm text-gray-900 font-mono">{user.Agent.sip_username || 'N/A'}</dd>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Call Statistics */}
//                   <div className="bg-white overflow-hidden shadow rounded-lg">
//                     <div className="px-4 py-5 sm:p-6">
//                       <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                         Call Statistics
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="bg-blue-50 p-4 rounded-lg">
//                           <div className="text-2xl font-bold text-blue-900">
//                             {user.Agent.totalCalls}
//                           </div>
//                           <div className="text-sm text-blue-700">Total Calls</div>
//                         </div>
//                         <div className="bg-green-50 p-4 rounded-lg">
//                           <div className="text-2xl font-bold text-green-900">
//                             {user.Agent.successCalls}
//                           </div>
//                           <div className="text-sm text-green-700">Successful Calls</div>
//                         </div>
//                         <div className="bg-red-50 p-4 rounded-lg">
//                           <div className="text-2xl font-bold text-red-900">
//                             {user.Agent.droppedCalls}
//                           </div>
//                           <div className="text-sm text-red-700">Dropped Calls</div>
//                         </div>
//                       </div>
//                       {user.Agent.totalCalls > 0 && (
//                         <div className="mt-4 bg-gray-50 p-4 rounded-lg">
//                           <div className="text-sm text-gray-600">Success Rate</div>
//                           <div className="text-xl font-semibold text-gray-900">
//                             {((user.Agent.successCalls / user.Agent.totalCalls) * 100).toFixed(1)}%
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Outbound Calls Tab */}
//           {activeTab === 'outbound' && user.Agent && (
//             <div className="space-y-6">
//               <div className="bg-white overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
//                     Make Outbound Call
//                   </h3>

//                   <div className="flex justify-center">
//                     <OutboundDialer
//                       agentId={user.id}
//                       onCallInitiated={handleCallInitiated}
//                       isCallInProgress={isCallInProgress}
//                       onEndCall={handleCallEnded}
//                     />
//                   </div>

//                   {/* Current Call Info */}
//                   {isCallInProgress && currentCall && (
//                     <div className="mt-6 bg-blue-50 rounded-lg p-4">
//                       <h4 className="font-medium text-blue-900 mb-2">Current Call</h4>
//                       <div className="text-sm text-blue-800">
//                         <div>From: {currentCall.fromNumber}</div>
//                         <div>To: {currentCall.toNumber}</div>
//                         {currentCall.callSid && <div>Call ID: {currentCall.callSid}</div>}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Inbound Calls Tab */}
//           {activeTab === 'inbound' && user.Agent && user.Agent.sip_username && (
//             <div className="space-y-6">
//               <div className="bg-white overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                     Inbound Call Interface
//                   </h3>
//                   <TwilioInboundAgent identity={user.Agent.sip_username} />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Non-Agent Message */}
//           {!user.Agent && (
//             <div className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6 text-center">
//                 <div className="text-gray-500">
//                   <h3 className="text-lg font-medium mb-2">Agent Access Required</h3>
//                   <p>Your account is not configured as an agent. Please contact your administrator for agent access.</p>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }
