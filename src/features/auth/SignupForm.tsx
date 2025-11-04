"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideMail,
  LucideUser2,
  LucideBuilding2,
  LucideGlobe,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import PasswordField from "./PasswordField";
import { signupSchema, SignupFormSchema } from "./utils/validation";
import { loginPath } from "@/paths";
import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import CheckboxField from "./CheckboxField";
import SelectField from "@/components/SelectField";
import AuthButton from "./AuthButton";
import { toast } from "sonner";
import { env } from "@/env";
import { industriesInformation } from "@/data/industriesInformation";
import CountrySelector from "@/features/auth/CountrySelector";
import AddressSelector from "./AddressSelector";

const MIN_STEP = 1;
const MAX_STEP = 2;

const variants: Variants = {
  initial: (direction: number) => ({
    opacity: 0.2,
    x: direction > 0 ? 100 : -100,
  }),
  exit: (direction: number) => ({
    opacity: 0.2,
    x: direction > 0 ? -100 : 100,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
      ease: "linear",
    },
  },
};

const defaultValues: SignupFormSchema = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  businessName: "",
  industry: "",
  website: "",
  address: "",
  phoneNumber: "",
  acceptTerms: true,
};

export default function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const form = useForm<SignupFormSchema>({
    mode: "all",
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  const onSubmit = async (formData: SignupFormSchema) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);
      if (response.ok) {
        toast.success(
          result?.message || "Please check your email for verification."
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        window.location.href =
          "/auth/verify-otp?email=" + encodeURIComponent(formData.email);
        return;
      }

      // ❌ Backend error response
      if (result?.errors?.length) {
        // Field-level validation errors
        result.errors.forEach((err: { field: string; message: string }) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        // General error message
        toast.error(result?.message || "Registration failed.");
      }
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Signup Request Error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const redirectLoginUrl = callbackUrl
    ? `${loginPath()}?callbackUrl=${callbackUrl}`
    : `${loginPath()}`;

  const acceptTerms = form.watch("acceptTerms");

  const handleNextStep = () => {
    setDirection(1);
    setStep((step) => Math.min(MAX_STEP, step + 1));
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setStep((step) => Math.max(MIN_STEP, step - 1));
  };

  // Validate current step
  const isStep1Valid = () => {
    const { name, email, phoneNumber, password, confirmPassword } =
      form.getValues();
    const errors = form.formState.errors;
    return (
      name &&
      email &&
      phoneNumber &&
      password &&
      confirmPassword &&
      !errors.name &&
      !errors.email &&
      !errors.phoneNumber &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  return (
    <AuthCard>
      <AuthCard.Header>
        <AuthCard.Title>Get Started Now</AuthCard.Title>
        <AuthCard.Subtitle>
          Create your account to access all features
        </AuthCard.Subtitle>
      </AuthCard.Header>
      <AuthCard.Content>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  custom={direction}
                >
                  <fieldset className="space-y-6">
                    <TextField
                      label="Full Name"
                      name="name"
                      placeholder="Enter your name"
                    >
                      <LucideUser2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <TextField
                      label="Email"
                      name="email"
                      placeholder="Enter your email"
                    >
                      <LucideMail className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <CountrySelector form={form} />
                    <PasswordField
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <PasswordField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Enter retype password"
                    />
                  </fieldset>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  custom={direction}
                >
                  <fieldset className="space-y-6">
                    <TextField
                      label="Business Name"
                      name="businessName"
                      placeholder="Write your business name"
                    >
                      <LucideBuilding2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>

                    <SelectField
                      className="w-full"
                      name="industry"
                      label="Select Industry"
                      required
                      placeholder="Choose your industry"
                      defaultValue="information-technology"
                      options={industriesInformation}
                    />

                    <TextField
                      label="Website"
                      name="website"
                      placeholder="Write your website"
                    >
                      <LucideGlobe className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <AddressSelector control={form.control} name="address" />
                    <CheckboxField
                      label="I accept the terms and conditions"
                      name="acceptTerms"
                      checked={acceptTerms}
                    />
                  </fieldset>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <Button
                  onClick={handlePrevStep}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={step === MIN_STEP}
                  className="rounded-full"
                >
                  Prev
                </Button>
                <Button
                  onClick={handleNextStep}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={
                    step === MAX_STEP || (step === 1 && !isStep1Valid())
                  }
                  className="rounded-full"
                >
                  Next
                </Button>
              </div>
              <AuthButton
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                isLoading={form.formState.isSubmitting}
                className="w-full mt-4"
                type="submit"
              >
                Submit
              </AuthButton>
            </div>
          </form>
        </Form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <AuthCard.Text>Already have an account?</AuthCard.Text>
        <AuthCard.Link href={redirectLoginUrl}>Login</AuthCard.Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}
