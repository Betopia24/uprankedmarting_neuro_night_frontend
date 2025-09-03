"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideMail,
  LucideUser2,
  LucidePhone,
  LucideBuilding2,
  LucideGlobe,
  LucideMapPin,
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

const defaultValues = {
  name: "John Doe",
  email: "john@doe.com",
  password: "1234zxcvQ!",
  confirmPassword: "1234zxcvQ!",
  businessName: "1234zxcv",
  industry: "information-technology",
  website: "http://example.com",
  address: "11,11,11",
  phoneNumber: "+8801670012716",
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
        toast.success(result?.message || "Registration successful!");
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
                      name="full_name"
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
                      placeholder="Write your contact number"
                    >
                      <LucidePhone className="size-9 p-2.5 absolute right-0 bottom-0" />
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
                      label="Industry"
                      required
                      placeholder="Choose your industry"
                      defaultValue="information-technology"
                      options={[
                        {
                          label: "Information Technology",
                          value: "information-technology",
                        },
                        {
                          label: "Healthcare & Biotechnology",
                          value: "healthcare-biotechnology",
                        },
                        {
                          label: "Education & E-Learning",
                          value: "education-elearning",
                        },
                        {
                          label: "Finance & Banking",
                          value: "finance-banking",
                        },
                        {
                          label: "E-Commerce & Retail",
                          value: "ecommerce-retail",
                        },
                        {
                          label: "Manufacturing & Supply Chain",
                          value: "manufacturing-supply",
                        },
                        {
                          label: "Media & Entertainment",
                          value: "media-entertainment",
                        },
                      ]}
                    />

                    <TextField
                      label="Website"
                      name="website"
                      placeholder="Write your website"
                    >
                      <LucideGlobe className="size-9 p-2.5 absolute right-0 bottom-0" />
                    </TextField>
                    <TextField
                      label="Address"
                      name="address"
                      placeholder="Write your address"
                    >
                      <LucideMapPin className="size-9 p-2.5 absolute right-0 bottom-0" />
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
