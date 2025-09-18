"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useCall } from "@/contexts/CallContext";
import CallPanel from "@/components/CallPanel";
import TwilioInboundAgent from "@/components/TwilioClient";
import Container from "@/components/Container";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  PhoneIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ChartBarIcon,
  SignalIcon,
} from "@heroicons/react/24/solid";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentCall, callStatus } = useCall();
  const [timeOfDay, setTimeOfDay] = useState<string>("");

  console.log({ user });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready";
      case "connecting":
        return "Connecting...";
      case "ringing":
        return "Ringing...";
      case "connected":
        return "Connected";
      case "error":
        return "Error";
      case "incoming":
        return "Incoming Call";
      default:
        return "Initializing...";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const successRate =
    user.Agent && user.Agent?.totalCalls > 0
      ? Math.round(
          ((user.Agent.successCalls || 0) / user.Agent.totalCalls) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good {timeOfDay}, {user.name.split(" ")[0]}
            </h1>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>

          {/* Call Status */}
          <AnimatePresence>
            {currentCall && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Call in Progress
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-900">
                    {getStatusText(callStatus)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Call Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Make a Call
                  </h2>
                  <p className="text-sm text-gray-600">Outbound dialer</p>
                </div>
              </div>
              <CallPanel />
            </motion.div>

            {/* Inbound Agent */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <SignalIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Inbound Calls
                  </h2>
                  <p className="text-sm text-gray-600">
                    Receive incoming calls
                  </p>
                </div>
              </div>
              <TwilioInboundAgent
                identity={(user.Agent && user.Agent.sip_username) || ""}
              />
            </motion.div>
          </div>

          {/* Profile & Agent Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile
                  </h3>
                  <p className="text-sm text-gray-600">Account information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {user.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Role
                  </label>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize">
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Phone
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                        user.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isVerified ? (
                        <CheckBadgeIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircleIcon className="w-3 h-3 mr-1" />
                      )}
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Agent Details */}
            {user.Agent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Agent Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Professional information
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Job Title
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {user.Agent.jobTitle}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Department
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {user.Agent.department}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                          user.Agent.status === "online"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.Agent.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        />
                        {user.Agent.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      SIP Username
                    </label>
                    <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                      {user.Agent.sip_username || "N/A"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Performance Stats */}
          {user.Agent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Performance Summary
                </h3>
                <p className="text-sm text-gray-600">Your calling statistics</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {user.Agent.totalCalls || 0}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Total Calls
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {user.Agent.successCalls || 0}
                  </div>
                  <div className="text-xs text-green-700 font-medium">
                    Successful
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {user.Agent.droppedCalls || 0}
                  </div>
                  <div className="text-xs text-red-700 font-medium">
                    Dropped
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {successRate}%
                  </div>
                  <div className="text-xs text-blue-700 font-medium">
                    Success Rate
                  </div>
                </div>
              </div>

              {/* Simple Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Success Rate
                  </span>
                  <span className="text-sm text-gray-600">{successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Dashboard;
