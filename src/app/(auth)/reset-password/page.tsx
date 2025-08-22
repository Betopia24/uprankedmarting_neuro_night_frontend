import AuthLayout from "@/components/auth/AuthLayout";
import { NewPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <NewPasswordForm />
    </AuthLayout>
  );
}
