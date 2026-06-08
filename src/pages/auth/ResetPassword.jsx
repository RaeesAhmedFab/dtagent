import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";

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
import { ResetPasswordSchema } from "@/schema/AuthSchema";
import Logo from "@/assets/dtagent.png";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../../redux/Api/adminapi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  const [resetPassword] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      toast.success("Password reset successfully. Please sign in.");
      navigate("/login");
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error(
        error?.data?.message ||
          "This reset link is invalid or has expired. Please request a new one."
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
            Reset password
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>

        {!token ? (
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              This password reset link is missing or invalid. Please request a
              new one.
            </p>
            <Button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-white text-foreground border border-gray-200 hover:border-[#003165] cursor-pointer"
            >
              Request a new link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">New password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={errors.password ? [errors.password] : undefined}
                />
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm new password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <FieldError
                  errors={
                    errors.confirmPassword ? [errors.confirmPassword] : undefined
                  }
                />
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-foreground border border-gray-200 hover:border-[#003165] cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset password
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

export default ResetPassword;
