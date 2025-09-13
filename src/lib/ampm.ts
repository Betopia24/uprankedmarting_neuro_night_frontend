/**
 * Convert "HH:mm:ss", ISO datetime, or already AM/PM string
 * into a clean "h:mm AM/PM" format, respecting local time zone.
 */
export function toAmPm(input: string | null | undefined): string {
  if (!input) return "N/A";

  const trimmed = input.trim();

  // Case 1: already AM/PM format → normalize spacing
  if (/^\d{1,2}:\d{2}(\s?[APap][Mm])$/.test(trimmed)) {
    const [time, meridian] = trimmed.split(/\s+/);
    return `${time} ${meridian.toUpperCase()}`;
  }

  let date: Date;

  // Case 2: pure "HH:mm:ss" → parse as local time
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    const [h, m, s] = trimmed.split(":").map(Number);
    date = new Date();
    date.setHours(h, m, s, 0);
  }
  // Case 3: full datetime string
  else {
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) return "Invalid time";
    date = parsed;
  }

  let hour = date.getHours();
  const minute = date.getMinutes();
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}
