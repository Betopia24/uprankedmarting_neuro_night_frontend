"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideMail,
  LucideUser2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import PasswordField from "./PasswordField";
import { toast } from "sonner";
import { signupSchema, SignupFormSchema } from "./validation";
import { signupPath } from "@/paths";
import { useState } from "react";
import SignupAnimation from "./SignupAnimation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Button } from "../ui/button";
import CheckboxField from "./CheckboxField";

const MIN_STEP = 1;
const MAX_STEP = 2;

const variants: Variants = {
  initial: (direction: number) => ({
    opacity: 0.2,
    x: direction > 0 ? 100 : -100,
    transition: {
      duration: 0.15,
      ease: "linear",
    },
  }),
  exit: (direction: number) => ({
    opacity: 0.2,
    x: direction > 0 ? -100 : 100,
    transition: {
      duration: 0.15,
      ease: "linear",
    },
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

const defaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  businessName: "",
  industry: "",
  website: "",
  businessAddress: "",
  phoneNumber: "",
  acceptTerms: false,
};

export default function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const form = useForm<SignupFormSchema>({
    mode: "all",
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  const onSubmit = async (formData: SignupFormSchema) => {};

  const redirectLoginUrl = callbackUrl
    ? `${signupPath()}?callbackUrl=${callbackUrl}`
    : `${signupPath()}`;

  const acceptTerms = form.watch("acceptTerms");

  const handleNextStep = () => {
    setDirection(1);
    setStep((step) => Math.min(MAX_STEP, step + 1));
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setStep((step) => Math.max(MIN_STEP, step - 1));
  };

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
                  custom={direction}
                >
                  <fieldset className="space-y-6">
                    <TextField
                      label="Name"
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
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      placeholder="Write your phone number"
                    >
                      <LucideUser2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
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
                      placeholder="Enter confirm password"
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
                  custom={direction}
                >
                  <fieldset className="space-y-6">
                    <TextField
                      label="Business Name"
                      name="businessName"
                      placeholder="Write your business name"
                    >
                      <LucideUser2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>

                    <TextField
                      label="Industry"
                      name="industry"
                      placeholder="Write your industry"
                    >
                      <LucideUser2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <TextField
                      label="Website"
                      name="website"
                      placeholder="Write your website"
                    >
                      <LucideUser2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <TextField
                      label="Business Address"
                      name="businessAddress"
                      placeholder="Write your business address"
                    >
                      <LucideUser2 className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <CheckboxField
                      label="I accept the terms and conditions"
                      name="acceptTerms"
                      checked={acceptTerms}
                    />
                  </fieldset>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between gap-4 mt-6">
              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={handlePrevStep}
                  type="button"
                  variant="secondary"
                  disabled={step === MIN_STEP}
                >
                  Prev
                </Button>
                <Button
                  onClick={handleNextStep}
                  type="button"
                  variant="secondary"
                  disabled={
                    step === MAX_STEP || (step === 1 && !isStep1Valid())
                  }
                >
                  Next
                </Button>
              </div>
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="flex-1"
                type="submit"
              >
                Submit
              </Button>
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
