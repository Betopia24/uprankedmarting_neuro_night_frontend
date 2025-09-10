import AuthLayout from "@/features/auth/AuthLayout";
import LoginForm from "@/features/auth/LoginForm";

export default async function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm callbackUrl="" />
    </AuthLayout>
  );
}
