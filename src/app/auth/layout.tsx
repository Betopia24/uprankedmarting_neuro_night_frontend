import { getServerAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminPaths } from "@/constants";

export default async function AuthRootLayout({
  children,
}: React.PropsWithChildren) {
  const auth: { data: { isVerified: boolean; role: string } } | null =
    await getServerAuth();

  if (!auth?.data?.isVerified) {
    return children;
  }

  return redirect(adminPaths[auth?.data?.role as keyof typeof adminPaths]);
}
