import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SettingsCard from "./SettingsCard";
import {
  useDangerZonetodayMutation,
  useDangerZoneresetMutation,
  useDangerZonepurgeMutation,
} from "../../redux/Api/adminSetting";

const DangerZoneCard = () => {
  const [flushCache, { isLoading: isFlushing }] = useDangerZonetodayMutation();
  const [resetSessions, { isLoading: isResetting }] =
    useDangerZoneresetMutation();
  const [purgeArticles, { isLoading: isPurging }] =
    useDangerZonepurgeMutation();

  const runAction = async (trigger, successMsg) => {
    try {
      await trigger({}).unwrap();
      toast.success(successMsg);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Action failed. Please try again."
      );
    }
  };

  const dangerActions = [
    {
      label: "Flush today's article cache",
      desc: "Forces all members to receive a fresh feed on next page load. Use after a bulk moderation sweep. Action logged in audit trail (AD-04).",
      btn: "Flush cache",
      icon: Trash2,
      onClick: () => runAction(flushCache, "Today's article cache flushed."),
      loading: isFlushing,
    },
    {
      label: "Reset active DTAgent sessions (all members)",
      desc: "Clears the Redis session-context cache for all members. Per SRS §2.4, no chat history is persisted between sessions in the pilot — this only terminates mid-session state.",
      btn: "Reset sessions",
      icon: RefreshCw,
      onClick: () => runAction(resetSessions, "Active DTAgent sessions reset."),
      loading: isResetting,
    },
    {
      label: "Purge removed articles (30 days hold expired)",
      desc: "Permanently deletes articles that have been in the removed queue for over 72 hours. Soft-delete window is 72 hours per AD-03; articles in hold are not affected.",
      btn: "Purge expired",
      icon: Trash2,
      onClick: () => runAction(purgeArticles, "Expired removed articles purged."),
      loading: isPurging,
    },
  ];

  return (
    <SettingsCard title="Danger zone" variant="danger">
      <div className="space-y-3">
        {dangerActions.map(({ label, desc, btn, icon: Icon, onClick, loading }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{label}</div>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 cursor-pointer "
              onClick={onClick}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
              {btn}
            </Button>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};

export default DangerZoneCard;
