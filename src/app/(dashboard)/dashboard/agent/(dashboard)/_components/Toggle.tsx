"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";
import { toast } from "sonner";

export default function Toggle() {
  const { token } = useAuth();
  const [isPhone, setIsPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current preference on mount
  useEffect(() => {
    const fetchPreference = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/users/agents/profile`,
          {
            method: "PATCH",
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsPhone(data.preferred_channel === "phone");
        }
      } catch (err) {
        console.error("Failed to fetch preference:", err);
      }
    };

    fetchPreference();
  }, [token]);

  const handleToggle = async () => {
    if (!token || isLoading) return;

    setIsLoading(true);
    const newChannel = isPhone ? "sip" : "phone";

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/agents/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            preferred_channel: newChannel,
          }),
        }
      );

      if (response.ok) {
        setIsPhone(!isPhone);
        toast.success("Channel updated", {
          description: `Preferred channel set to ${
            newChannel.toUpperCase() === "SIP" ? "WEB" : "PHONE"
          }`,
        });
      } else {
        throw new Error("Failed to update preference");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message || "Failed to update channel preference",
        });
      }
      console.error("Toggle error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <button
        onClick={handleToggle}
        disabled={isLoading || !token}
        className={`relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-green-200 ${
          isPhone ? "bg-green-600" : "bg-gray-300"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={`Switch to ${isPhone ? "SIP" : "Phone"}`}
      >
        <motion.div
          className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
          animate={{
            x: isPhone ? 40 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div
                  className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={isPhone ? "phone" : "web"}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {isPhone ? (
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      <div className="gap-6 text-xs text-gray-500 h-5 hidden lg:flex">
        <motion.div
          className={`flex items-center gap-1 transition-all duration-200 ${
            !isPhone ? "font-semibold text-gray-700" : ""
          }`}
          animate={{
            scale: !isPhone ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${
              !isPhone ? "bg-gray-600" : "bg-gray-300"
            }`}
            animate={{
              scale: !isPhone ? 1.2 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          Web
        </motion.div>
        <motion.div
          className={`flex items-center gap-1 transition-all duration-200 ${
            isPhone ? "font-semibold text-green-700" : ""
          }`}
          animate={{
            scale: isPhone ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${
              isPhone ? "bg-green-600" : "bg-gray-300"
            }`}
            animate={{
              scale: isPhone ? 1.2 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          Phone
        </motion.div>
      </div>
    </div>
  );
}
