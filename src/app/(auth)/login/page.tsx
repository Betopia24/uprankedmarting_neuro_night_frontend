import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm callbackUrl="" />
    </AuthLayout>
  );
}
