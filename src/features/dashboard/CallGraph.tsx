import { Heading } from "@/components";
import { cn } from "@/lib/utils";
import { formatCallTime } from "@/utils/formatCallTime";

type CallStats = {
  totalCalls: number | string;
  totalHumanCalls: number | string;
  totalAICalls: number | string;
  totalSuccessCalls: number | string;
  todayHumanCalls: number | string;
  todayAICalls: number | string;
  todaySuccessCalls: number | string;
  avgCallTime: number | string;
  avgAICallTime: number | string;
  avgHumanCallTime: number | string;
};

const classes = {
  variant1: {
    border: "border-blue-500 dark:border-blue-400",
    text: "text-blue-600 dark:text-blue-300",
  },
  variant2: {
    border: "border-yellow-500 dark:border-yellow-400",
    text: "text-yellow-600 dark:text-yellow-300",
  },

  variant3: {
    border: "border-red-500 dark:border-red-400",
    text: "text-red-600 dark:text-red-300",
  },
  variant4: {
    border: "border-green-500 dark:border-green-400",
    text: "text-green-600 dark:text-green-300",
  },
  variant5: {
    border: "border-purple-500 dark:border-purple-400",
    text: "text-purple-600 dark:text-purple-300",
  },
  variant6: {
    border: "border-pink-500 dark:border-pink-400",
    text: "text-pink-600 dark:text-pink-300",
  },
  variant7: {
    border: "border-indigo-500 dark:border-indigo-400",
    text: "text-indigo-600 dark:text-indigo-300",
  },
  variant8: {
    border: "border-teal-500 dark:border-teal-400",
    text: "text-teal-600 dark:text-teal-300",
  },
};

export default function CallGraph({ callStats }: { callStats: CallStats }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <Circle
        value={formatNumber(callStats.totalCalls)}
        label="Total Calls"
        variant={classes.variant1}
      />
      <Circle
        value={formatNumber(callStats.totalHumanCalls)}
        label="Total Human Calls"
        variant={classes.variant2}
      />
      <Circle
        value={formatNumber(callStats.totalAICalls)}
        label="Total AI Calls"
        variant={classes.variant3}
      />
      <Circle
        value={formatNumber(callStats.totalSuccessCalls)}
        label="Successful Calls"
        variant={classes.variant4}
      />
      <Circle
        value={formatNumber(callStats.todayHumanCalls)}
        label="Today's Human Calls"
        variant={classes.variant5}
      />
      <Circle
        value={formatNumber(callStats.todayAICalls)}
        label="Today's AI Calls"
        variant={classes.variant6}
      />
      <Circle
        value={formatNumber(callStats.todaySuccessCalls)}
        label="Today's Success Calls"
        variant={classes.variant7}
      />
      <Circle
        value={formatCallTime(Number(callStats.avgCallTime))}
        label="Avg. Call Time"
        variant={classes.variant8}
      />{" "}
    </div>
  );
}

function formatNumber(value: number | string): string {
  const numValue = Number(value);
  if (isNaN(numValue)) return value.toString();
  if (numValue < 1000) return value.toString();

  const suffixes = ["", "k", "m", "b", "t"];
  const suffixNum = Math.floor(("" + value).length / 3);
  let shortValue = 0;

  for (let precision = 2; precision >= 1; precision--) {
    shortValue = parseFloat(
      (numValue / Math.pow(1000, suffixNum)).toFixed(precision)
    );
    const shortValueStr = shortValue.toString().replace(/\.0$/, "");
    if (shortValueStr.length <= 3) {
      return shortValueStr + suffixes[suffixNum];
    }
  }
  return value.toString();
}

function Circle({
  value,
  label,
  variant,
}: {
  value: number | string;
  label: string;
  variant: { border: string; text: string };
}) {
  return (
    <div className="bg-gray-200 px-6 py-8 flex flex-col justify-center rounded space-y-2">
      <Heading as="h3" size="h6" className={cn(variant.text, "truncate")}>
        {label}
      </Heading>
      <div
        className={cn(
          "flex items-center justify-center rounded-full border-4 md:border-8 size-20 lg:size-24 xl:size-30 font-bold text-lg md:text-xl lg:text-2xl shrink-0 mx-auto",
          variant.border,
          variant.text
        )}
      >
        {value || 0}
      </div>
    </div>
  );
}
