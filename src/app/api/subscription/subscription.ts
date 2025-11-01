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

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch subscription info");
  }

  console.log(json);

  return json;
};
