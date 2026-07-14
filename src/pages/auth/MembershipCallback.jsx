import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/dtagent.png";
import { toast } from "sonner";
import { useLazyYmCallbackQuery } from "../../redux/Api/adminapi";
import { setCredentials } from "../../redux/apiSlice/authSlice";
import { persistor } from "../../redux/store/store";

const MembershipCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const code = searchParams.get("code");

  const [triggerYmCallback, { isFetching: isLoading }] = useLazyYmCallbackQuery();

  useEffect(() => {
    const exchangeCode = async () => {
      if (!code) {
        toast.error("Missing authorization code.");
        navigate("/login");
        return;
      }

      try {
        const response = await triggerYmCallback(code).unwrap();

        const authPayload = response?.data || response;

        localStorage.setItem(
          "auth_data",
          JSON.stringify({
            user: authPayload.user,
            tokens: authPayload.tokens || {
              access: { token: authPayload.access },
              refresh: { token: authPayload.refresh },
            },
          })
        );

        dispatch(
          setCredentials({
            user: authPayload.user,
            token: authPayload.tokens?.access?.token || authPayload.access,
            refreshToken:
              authPayload.tokens?.refresh?.token || authPayload.refresh,
          })
        );

        toast.success("Membership login successful!");

        await persistor.flush();

        const allowedRoles = ["dta_operations", "dta_content_lead", "admin"];
        const userRole = authPayload.user?.role;
        const destination = allowedRoles.includes(userRole)
          ? "/admin/dashboard"
          : "/member/dailydigest";

        navigate(destination);
      } catch (error) {
        console.error("Membership callback failed:", error);
        toast.error(
          error?.data?.message || "Membership login failed. Please try again."
        );
        navigate("/login");
      }
    };

    exchangeCode();
  }, [code, triggerYmCallback, navigate]);

  return (
    <div className="min-h-screen w-full bg-[#eef0f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader className="p-0">
          <div className="flex justify-center mb-5">
            <img
              src={Logo}
              alt="DTAgent"
              className="h-14 w-14 object-contain"
            />
          </div>
          <CardTitle className="text-center text-[22px]">
            Completing sign in
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Please wait while we finish connecting your membership account.
          </CardDescription>
        </CardHeader>

        <div className="mt-6 flex flex-col items-center gap-3">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-[#003165]" />}
        </div>
      </Card>
    </div>
  );
};

export default MembershipCallback;
