export interface PlatformOverviewStats {
  totalOrganizations: number;
  totalCalls: number;
  totalHumanCalls: number;
  totalAICalls: number;
}

export const getPlatformOverviewStats = async (
): Promise<PlatformOverviewStats> => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organizations/platform-overview-stats`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    let errText = "Failed to fetch platform overview stats";
    try {
      const json = await res.json();
      if (json?.message) errText = json.message;
    } catch {}
    throw new Error(errText);
  }

  const json = await res.json();
  return json.data;
};
