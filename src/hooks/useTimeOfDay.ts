"use client";

import { useEffect, useState } from "react";

const useTimeOfDay = () => {
  const [timeOfDay, setTimeOfDay] = useState<
    "morning" | "afternoon" | "evening"
  >("morning");

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeOfDay("morning");
      else if (hour < 18) setTimeOfDay("afternoon");
      else setTimeOfDay("evening");
    };

    updateTimeOfDay(); // run immediately
    const interval = setInterval(updateTimeOfDay, 60 * 1000); // recheck every minute

    return () => clearInterval(interval);
  }, []);

  return timeOfDay;
};

export default useTimeOfDay;
