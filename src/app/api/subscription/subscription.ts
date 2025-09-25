export const getSubscriptionType = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/my-subscription`,
    {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch subscription info");
  }

  return res.json();
};
