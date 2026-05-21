import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import SettingsCard from "./SettingsCard";

const DangerZoneCard = () => {
  const dangerActions = [
    {
      label: "Flush today's article cache",
      desc: "Forces all members to receive a fresh feed on next page load. Use after a bulk moderation sweep. Action logged in audit trail (AD-04).",
      btn: "Flush cache",
      icon: Trash2,
    },
    {
      label: "Reset active DTAgent sessions (all members)",
      desc: "Clears the Redis session-context cache for all members. Per SRS §2.4, no chat history is persisted between sessions in the pilot — this only terminates mid-session state.",
      btn: "Reset sessions",
      icon: RefreshCw,
    },
    {
      label: "Purge removed articles (72-hour hold expired)",
      desc: "Permanently deletes articles that have been in the removed queue for over 72 hours. Soft-delete window is 72 hours per AD-03; articles in hold are not affected.",
      btn: "Purge expired",
      icon: Trash2,
    },
  ];

  return (
    <SettingsCard title="Danger zone" variant="danger">
      <div className="space-y-3">
        {dangerActions.map(({ label, desc, btn, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{label}</div>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-2">
              <Icon className="h-3 w-3" />
              {btn}
            </Button>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};

export default DangerZoneCard;
