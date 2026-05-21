import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Info } from "lucide-react";

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
  const [digest, setDigest]   = useState("off");
  const [smsOn,  setSmsOn]   = useState(true);

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
              onCheckedChange={setSmsOn}
              className="mt-0.5 data-[state=checked]:bg-[#1b4b8a]"
            />
            <div>
              <p className="text-[13px] font-semibold text-gray-900 leading-tight mb-0.5">
                Daily SMS to (***) ***-4192
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

      {/* ── Action buttons ── */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <Button variant="outline" className="cursor-pointer">Cancel</Button>
        <Button className="bg-[#1b4b8a] hover:bg-[#163d72] cursor-pointer gap-1.5">
          <Check size={13} /> Save preferences
        </Button>
      </div>

    </div>
  );
};

export default Alertpreferences;