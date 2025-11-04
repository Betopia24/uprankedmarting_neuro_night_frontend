import React from "react";
import ProfileContainerPage from "./_container/ProfileContainer";
import { getAccessToken } from "@/lib/auth";

export default async function SettingsPage() {
  const accessToken = await getAccessToken();

  let subscription;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/my-subscription`,
      {
        method: "GET",
        headers: {
          Authorization: accessToken || "",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch subscription info");

    const data = await response.json();
    subscription = data;
  } catch {
    console.error("Failed to fetch subscription info");
  }

  return <ProfileContainerPage planLevel={subscription?.data?.planLevel} />;
}
