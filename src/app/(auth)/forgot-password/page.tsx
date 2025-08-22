import AuthLayout from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
