// app/profile/_components/profile-stats.tsx
type StatsProps = {
  totalAssignCall: number;
  totalAvgCallTime: string;
  totalCompleteCall: number;
  newAssignCall: number;
  avgCall: string;
  responseTime: string;
};

export default function ProfileStats({ stats }: { stats: StatsProps }) {
  const entries = [
    { label: "Total Assign Call", value: stats.totalAssignCall },
    { label: "Total Avg Call Time", value: stats.totalAvgCallTime },
    { label: "Total Complete Call", value: stats.totalCompleteCall },
    { label: "New Assign Call", value: stats.newAssignCall },
    { label: "Avg Call", value: stats.avgCall },
    { label: "Response Time", value: stats.responseTime },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
      {entries.map((item, i) => (
        <div key={i} className="bg-gray-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
