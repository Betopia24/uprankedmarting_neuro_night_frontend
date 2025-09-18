export function formatSecondsToHMS(seconds?: number | null): string {
  if (seconds == null || isNaN(seconds)) {
    return "—";
  }

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hrs, mins, secs]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}
