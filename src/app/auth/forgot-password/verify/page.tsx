import OTPForm from "./_components/VerifyOTP";

type Props = {
  searchParams: Promise<{
    mode: "verify" | "reset";
  }>;
};

export default async function VerifyOTPPage({ searchParams }: Props) {
  return <OTPForm />;
}
