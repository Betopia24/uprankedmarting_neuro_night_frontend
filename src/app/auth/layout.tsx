import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminPaths } from "@/constants";

export default async function AuthRootLayout({
  children,
}: React.PropsWithChildren) {
  const auth: { data: { isVerified: boolean; role: string } } | null =
    await requireAuth();
  if (auth?.data?.isVerified)
    return redirect(adminPaths[auth?.data?.role as keyof typeof adminPaths]);
  return children;
}
