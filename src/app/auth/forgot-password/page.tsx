import AuthLayout from "@/features/auth/AuthLayout";
import { ForgotPasswordForm } from "@/features/auth/ResetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
