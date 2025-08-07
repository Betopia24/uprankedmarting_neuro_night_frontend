// app/profile/page.tsx
import ProfileHeader from "./_components/profile-header";
import ProfileStats from "./_components/profile-stats";
import ProfileForm from "./_components/profile-form";

export default function ProfilePage() {
  const user = {
    name: "Shafiqu",
    stats: {
      totalAssignCall: 350,
      totalAvgCallTime: "350 hour",
      totalCompleteCall: 350,
      newAssignCall: 350,
      avgCall: "40s",
      responseTime: "20s",
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">My Profile</h1>
      <ProfileHeader name={user.name} />
      <ProfileStats stats={user.stats} />
      <ProfileForm />
    </div>
  );
}
