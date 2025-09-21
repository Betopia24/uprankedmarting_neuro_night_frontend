export function formatCallTime(seconds: number): string {
  // Define the conversion thresholds
  const MIN_IN_SEC = 60;
  const HR_IN_SEC = 3600;
  const DAY_IN_SEC = 86400;
  const MONTH_IN_SEC = 2592000;
  const YEAR_IN_SEC = 31536000;

  // Check for negative values
  if (seconds < 0) {
    return "Invalid time";
  }

  // Determine which time unit to use and truncate the value
  if (seconds < 100) {
    return `${Math.floor(seconds)}s`;
  } else if (seconds < 100 * MIN_IN_SEC) {
    const minutes = Math.floor(seconds / MIN_IN_SEC);
    return `${minutes}m`;
  } else if (seconds < 100 * HR_IN_SEC) {
    const hours = Math.floor(seconds / HR_IN_SEC);
    return `${hours}h`;
  } else if (seconds < 100 * DAY_IN_SEC) {
    const days = Math.floor(seconds / DAY_IN_SEC);
    return `${days}d`;
  } else if (seconds < 100 * MONTH_IN_SEC) {
    const months = Math.floor(seconds / MONTH_IN_SEC);
    return `${months}mo`;
  } else {
    const years = Math.floor(seconds / YEAR_IN_SEC);
    return `${years}y`;
  }
}
