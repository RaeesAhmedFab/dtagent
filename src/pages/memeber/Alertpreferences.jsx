import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Check, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../../redux/Api/adminapi";
import Loader from "../../components/Loader"

const EMAIL_OPTIONS = [
  {
    id: "daily",
    label: "Daily",
    description: "Every morning at 8:00 AM EST · top 5 stories with summaries",
  },
  {
    id: "weekly",
    label: "Weekly roundup",
    description: "Friday morning · the week's biggest 10 stories",
  },
  {
    id: "off",
    label: "Off",
    description: "No emails — visit dtagent.dentaltradealliance.org directly",
  },
];

const Alertpreferences = () => {
  const { data: prefsData, isLoading: isFetching } =
    useGetNotificationPreferencesQuery();
  const [updatePrefs, { isLoading: isSaving }] =
    useUpdateNotificationPreferencesMutation();

  const [digest, setDigest] = useState("off");
  const [smsOn, setSmsOn] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Dialog state
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  // Populate local state from API response once data arrives
  const prefInitialized = useRef(false);
  useEffect(() => {
    if (prefsData?.data && !prefInitialized.current) {
      const p = prefsData.data;
      setDigest(p.email_digest || "off");
      setSmsOn(p.sms_alert ?? false);
      setPhoneDisplay(p.phone_number_display || "");
      setPhoneNumber(p.phone_number || "");
      prefInitialized.current = true;
    }
  }, [prefsData]);

  const handleSmsToggle = (checked) => {
    if (checked && !phoneNumber) {
      // No phone number saved yet — open dialog to collect it
      setPhoneInput("");
      setShowPhoneDialog(true);
    } else {
      setSmsOn(checked);
    }
  };

  const handlePhoneDialogConfirm = () => {
    const trimmed = phoneInput.trim();
    if (!trimmed) {
      toast.error("Please enter a phone number.");
      return;
    }
    setPhoneNumber(trimmed);
    setPhoneDisplay(trimmed);
    setSmsOn(true);
    setShowPhoneDialog(false);
  };

  const handleSave = async () => {
    try {
      const payload = {
        email_digest: digest,
        sms_alert: smsOn,
      };
      if (phoneNumber) {
        payload.phone_number = phoneNumber;
      }
      await updatePrefs(payload).unwrap();
      toast.success("Notification preferences saved.");
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to save preferences. Please try again."
      );
    }
  };

  if (isFetching) {
    return (
     <>
     <Loader/>
     </>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl">

      {/* ── Email digest ── */}
      <Card className="w-full">
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="text-[14px] font-semibold text-gray-900">Email digest</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          {EMAIL_OPTIONS.map((opt, i) => (
            <div
              key={opt.id}
              className={`flex items-start gap-3 py-3 cursor-pointer ${i > 0 ? "border-t border-gray-100" : ""}`}
              onClick={() => setDigest(opt.id)}
            >
              {/* Custom radio */}
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                digest === opt.id
                  ? "border-[#1b4b8a] bg-[#1b4b8a]"
                  : "border-gray-300 bg-white"
              }`}>
                {digest === opt.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900 leading-tight mb-0.5">{opt.label}</p>
                <p className="text-[12px] text-gray-400">{opt.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── SMS alerts ── */}
      <Card className="w-full mt-4">
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="text-[14px] font-semibold text-gray-900">SMS alerts</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {/* Toggle row */}
          <div className="flex items-start gap-3 mb-4">
            <Switch
              checked={smsOn}
              onCheckedChange={handleSmsToggle}
              className="mt-0.5 data-[state=checked]:bg-[#1b4b8a]"
            />
            <div>
              <p className="text-[13px] font-semibold text-gray-900 leading-tight mb-0.5">
                {phoneDisplay
                  ? `Daily SMS to ${phoneDisplay}`
                  : "Daily SMS"}
              </p>
              <p className="text-[12px] text-gray-400">
                One text per day at 8:00 AM EST. Reply STOP at any time to unsubscribe.
              </p>
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
            <Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-700 leading-relaxed">
              Carrier rates may apply. By opting in you agree to receive automated texts from DTA.
              Consent is not a condition of membership. (TCPA-compliant)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Phone number dialog ── */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Enter phone number</DialogTitle>
            <DialogDescription>
              A phone number is required to enable SMS alerts.
            </DialogDescription>
          </DialogHeader>

          <Input
            type="tel"
            placeholder="+1 (555) 123-4192"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowPhoneDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1b4b8a] hover:bg-[#163d72] cursor-pointer"
              onClick={handlePhoneDialogConfirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Action buttons ── */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <Button variant="outline" className="cursor-pointer">Cancel</Button>
        <Button
          className="bg-[#1b4b8a] hover:bg-[#163d72] cursor-pointer gap-1.5"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check size={13} />
          )}
          Save preferences
        </Button>
      </div>

    </div>
  );
};

export default Alertpreferences;