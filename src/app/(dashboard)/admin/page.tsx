import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <p>Welcome, {session?.user?.name}</p>
        <p>Your role is: {session?.user?.role}</p>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit" className="w-full py-2 mt-4 text-white bg-red-500 rounded-md">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
