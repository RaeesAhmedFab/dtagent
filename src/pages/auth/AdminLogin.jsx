import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
import { AdminLoginSchema } from "@/schema/AuthSchema";
import Logo from "@/assets/dtagent.png";
import { toast } from "sonner";
import { usePostAdminLoginMutation } from "../../redux/Api/adminapi";
import { setCredentials } from "../../redux/apiSlice/authSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [postAdminLogin] = usePostAdminLoginMutation();

  const onSubmit = async (data) => {
    try {
      const response = await postAdminLogin(data).unwrap();

      // Save the logged-in user + tokens into the redux store.
      dispatch(
        setCredentials({
          user: response.user,
          token: response.tokens.access.token,
          refreshToken: response.tokens.refresh.token,
        })
      );

      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef0f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader className="p-0">
          <div className="flex justify-center mb-5">
            <img src={Logo} alt="DTAgent" className="h-14 w-14 object-contain" onClick={()=>navigate("/")} />
          </div>
          <CardTitle className="text-center text-[22px]">
            Welcome to DTAgent
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Sign in with your DentalTradeAlliance.org account to read today's
            AI-curated dental news.
          </CardDescription>
        </CardHeader>

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

            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#003165] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-foreground border border-gray-200 hover:border-[#003165] cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                ""
              )}
              Login
            </Button>
          </FieldGroup>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
