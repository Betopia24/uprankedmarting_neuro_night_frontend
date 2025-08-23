/** Predefined 8-hour shifts */
export const shifts = {
  "9-5": { start: "09:00:00.000Z", end: "17:00:00.000Z" },
  "5-1": { start: "17:00:00.000Z", end: "01:00:00.000Z" },
  "1-9": { start: "01:00:00.000Z", end: "09:00:00.000Z" },
} as const;

export const shiftKeys = Object.keys(shifts) as (keyof typeof shifts)[];
