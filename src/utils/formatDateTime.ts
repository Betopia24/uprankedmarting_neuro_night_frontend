// utils/dateTime.ts
export function formatDateTime(input?: string | null): string {
  if (!input) return "—";

  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-US", {
    month: "short", // Sep
    day: "2-digit", // 17
    year: "numeric", // 2025
    hour: "2-digit", // 07
    minute: "2-digit", // 44
    hour12: true, // AM/PM
  });
}
