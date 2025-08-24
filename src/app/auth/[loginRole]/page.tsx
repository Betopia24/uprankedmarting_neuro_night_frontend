import AuthLayout from "@/features/auth/AuthLayout";
import LoginForm from "@/features/auth/LoginForm";

type RoleBasedLoginParams = {
  params: Promise<{
    loginRole: string;
  }>;
};

const ROLE_BASED_API_ROUTES = {
  admin: "/api/admin/login",
  organization: "/api/organization/login",
  agent: "/api/agent/login",
} as const;

export default async function LoginPage({ params }: RoleBasedLoginParams) {
  const { loginRole } = await params;
  const apiRoute =
    ROLE_BASED_API_ROUTES[loginRole as keyof typeof ROLE_BASED_API_ROUTES] ??
    "";

  if (!apiRoute) {
    return (
      <AuthLayout>
        <p>Invalid role</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <LoginForm callbackUrl="" />
    </AuthLayout>
  );
}
