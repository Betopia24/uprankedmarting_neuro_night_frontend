import OTPForm from "@/features/auth/OTPForm";

type Props = {
  searchParams: Promise<{
    mode: "verify" | "reset";
  }>;
};

export default async function VerifyOTPPage({ searchParams }: Props) {
  return <OTPForm />;
}
