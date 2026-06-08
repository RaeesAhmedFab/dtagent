import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ForgotPasswordSchema } from "@/schema/AuthSchema";
import Logo from "@/assets/dtagent.png";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "../../redux/Api/adminapi";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [sentTo, setSentTo] = useState("");

  const [forgotPassword] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      setSentTo(data.email);
      toast.success("We've sent a password reset link to your email.");
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error(
        error?.data?.message || "Could not send the reset link. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef0f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader className="p-0">
          <div className="flex justify-center mb-5">
            <img
              src={Logo}
              alt="DTAgent"
              className="h-14 w-14 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <CardTitle className="text-center text-[22px]">
            {sentTo ? "Check your email" : "Forgot password?"}
          </CardTitle>
          <CardDescription className="text-center text-sm">
            {sentTo
              ? `We've sent a password reset link to ${sentTo}. Open the link in that email to set a new password.`
              : "Enter the email linked to your account and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>

        {sentTo ? (
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <MailCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Didn't get the email? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setSentTo("")}
                className="text-[#003165] hover:underline"
              >
                try a different email
              </button>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@gmail.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={errors.email ? [errors.email] : undefined} />
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-foreground border border-gray-200 hover:border-[#003165] cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Send reset link
              </Button>
            </FieldGroup>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 flex items-center justify-center gap-1.5 text-sm text-[#003165] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
      </Card>
    </div>
  );
};

export default ForgetPassword;
