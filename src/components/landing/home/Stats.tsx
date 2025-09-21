"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Container } from "@/components";
import Section from "@/components/Section";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";
import { env } from "@/env";
import { getPlatformOverviewStats } from "@/app/api/home-stats/home-stats";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    value % 1 === 0 ? Math.round(latest).toLocaleString() : latest.toFixed(2)
  );

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 3.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = rounded.onChange((latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.span>
      {displayValue}
      {suffix}
    </motion.span>
  );
}

export default function Stats() {
  const [statsData, setStatsData] = useState<
    { value: number; suffix?: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getPlatformOverviewStats();
        if (response) {
          setStatsData([
            {
              value: response.totalOrganizations,
              suffix: "+",
              label: "Organization",
            },
            {
              value: response.totalCalls,
              suffix: "+",
              label: "Total Calls",
            },
            {
              value: response.totalHumanCalls,
              suffix: "+",
              label: "Human Calls",
            },
            {
              value: response.totalAICalls,
              suffix: "+",
              label: "AI Calls",
            },
          ]);
        } else {
          toast.error("Failed to load stats information");
        }
      } catch (error) {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error("Error fetching stats info:", error);
        toast.error("Failed to load stats information");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (statsData.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap gap-6 lg:gap-10 max-w-4xl mx-auto py-12">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white flex-1 p-10 rounded-xl shadow text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 1, delay: index * 0.15 }}
            >
              <p className="text-4xl lg:text-[32px] font-bold">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-gray-600 mt-2 font-light text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
