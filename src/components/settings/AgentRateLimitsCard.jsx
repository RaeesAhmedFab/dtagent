import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import SettingsCard from "./SettingsCard";
import SliderField from "./SliderField";

const AgentRateLimitsCard = ({ sessionCap, setSessionCap, dayCap, setDayCap }) => {
  return (
    <SettingsCard title="Agent rate limits" badge="AG-08 · NF-11">
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Two independent caps apply. <strong>Session cap</strong> (AG-08): max queries per single browser visit — resets when the session ends. <strong>Daily cap</strong> (NF-11): max queries per member per calendar day (EST). Members see a live counter in the agent panel.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderField
          label="Per-session query limit (default 20, AG-08)"
          value={sessionCap}
          onChange={setSessionCap}
          min={5}
          max={50}
          step={5}
          description="Resets on new session. Default: 20 (confirmed on call, AG-08)."
        />

        <SliderField
          label="Per-member daily query limit (default 100, NF-11)"
          value={dayCap}
          onChange={setDayCap}
          min={20}
          max={500}
          step={10}
          description="Resets at midnight EST. Tracked in Redis. Default: 100 (NF-11)."
        />
      </div>
    </SettingsCard>
  );
};

export default AgentRateLimitsCard;
