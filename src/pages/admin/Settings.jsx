import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import ProfileCard from "@/components/settings/ProfileCard";
import UpdatePasswordCard from "@/components/settings/UpdatePasswordCard";
import AISummarizationCard from "@/components/settings/AISummarizationCard";
import ScrapeScheduleCard from "@/components/settings/ScrapeScheduleCard";
import AgentRateLimitsCard from "@/components/settings/AgentRateLimitsCard";
import ApiCredentialsCard from "@/components/settings/ApiCredentialsCard";
import SecurityCard from "@/components/settings/SecurityCard";
import DangerZoneCard from "@/components/settings/DangerZoneCard";
import { useGetSystemSettingQuery, useUpdateSystemSettingMutation,useGetAPiCredentialsQuery,useDangerZonetodayMutation,useDangerZoneresetMutation,useDangerZonepurgeMutation } from "../../redux/Api/adminSetting";
const Settings = () => {
  const [scrapeTime, setScrapeTime] = useState('05:00');
  const [aiModel, setAiModel] = useState('gpt-4-turbo');
  const [summaryLen, setSummaryLen] = useState(120);
  const [maxArticles, setMaxArticles] = useState(200);
  const [alertLow, setAlertLow] = useState(30);
  const [alertHigh, setAlertHigh] = useState(400);
  const [paywallDetect, setPaywallDetect] = useState(true);
  const [dualScrape, setDualScrape] = useState(true);
  const [sessionCap, setSessionCap] = useState(20);
  const [dayCap, setDayCap] = useState(100);
  const [requireYmSso, setRequireYmSso] = useState(true);
  const [useYmAdminPermissions, setUseYmAdminPermissions] = useState(true);
  const [sanitizeAgentInputs, setSanitizeAgentInputs] = useState(true);
  const [enforceHttps, setEnforceHttps] = useState(true);
  const [saved, setSaved] = useState(false);
  const { data: systemSettings, isLoading, isSuccess } = useGetSystemSettingQuery();
  const settings = systemSettings?.data;
  const { data: apiCredentials, isLoading: isApiLoading, isSuccess: isApiSuccess, refetch: refetchApiCredentials } = useGetAPiCredentialsQuery();

  const [updateSystemSetting, { isLoading: isSaving }] = useUpdateSystemSettingMutation();

  useEffect(() => {
    if (!isSuccess || !settings) return;
    setScrapeTime(settings.primary_run_time || '05:00');
    setAiModel(settings.ai_model || 'gpt-4-turbo');
    setSummaryLen(settings.summary_target_words || 120);
    setMaxArticles(settings.max_articles_per_run || 200);
    setAlertLow(settings.article_alert_min || 30);
    setAlertHigh(settings.article_alert_max || 400);
    setPaywallDetect(settings.exclude_paywalled_articles ?? true);
    setDualScrape(settings.enable_predispatch_rescrape ?? true);
    setSessionCap(settings.session_query_limit || 20);
    setDayCap(settings.daily_member_query_limit || 100);
    setRequireYmSso(settings.require_ym_sso ?? true);
    setUseYmAdminPermissions(settings.use_ym_admin_permissions ?? true);
    setSanitizeAgentInputs(settings.sanitize_agent_inputs ?? true);
    setEnforceHttps(settings.enforce_https ?? true);
  }, [isSuccess, settings]);

  const handleSave = async () => {
    try {
      await updateSystemSetting({
        id: settings?.id,
        data: {
          ai_model: aiModel,
          summary_target_words: summaryLen,
          exclude_paywalled_articles: paywallDetect,
          primary_run_time: scrapeTime,
          article_alert_min: alertLow,
          article_alert_max: alertHigh,
          max_articles_per_run: maxArticles,
          enable_predispatch_rescrape: dualScrape,
          session_query_limit: sessionCap,
          daily_member_query_limit: dayCap,
          require_ym_sso: requireYmSso,
          use_ym_admin_permissions: useYmAdminPermissions,
          sanitize_agent_inputs: sanitizeAgentInputs,
          enforce_https: enforceHttps,
        },
      }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  return (
    <div className="">
      {/* <ProfileCard />

      <UpdatePasswordCard /> */}

      <AISummarizationCard
        aiModel={aiModel}
        setAiModel={setAiModel}
        summaryLen={summaryLen}
        setSummaryLen={setSummaryLen}
        paywallDetect={paywallDetect}
        setPaywallDetect={setPaywallDetect}
      />

      <ScrapeScheduleCard
        scrapeTime={scrapeTime}
        setScrapeTime={setScrapeTime}
        maxArticles={maxArticles}
        setMaxArticles={setMaxArticles}
        alertLow={alertLow}
        setAlertLow={setAlertLow}
        alertHigh={alertHigh}
        setAlertHigh={setAlertHigh}
        dualScrape={dualScrape}
        setDualScrape={setDualScrape}
      />

      <AgentRateLimitsCard
        sessionCap={sessionCap}
        setSessionCap={setSessionCap}
        dayCap={dayCap}
        setDayCap={setDayCap}
      />

      <ApiCredentialsCard
        apiCredentials={apiCredentials}
        isLoading={isApiLoading}
        isSuccess={isApiSuccess}
        refetch={refetchApiCredentials}
      />

      <SecurityCard
        requireYmSso={requireYmSso}
        setRequireYmSso={setRequireYmSso}
        useYmAdminPermissions={useYmAdminPermissions}
        setUseYmAdminPermissions={setUseYmAdminPermissions}
        sanitizeAgentInputs={sanitizeAgentInputs}
        setSanitizeAgentInputs={setSanitizeAgentInputs}
        enforceHttps={enforceHttps}
        setEnforceHttps={setEnforceHttps}
      />

      <DangerZoneCard />

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" className="cursor-pointer" >Discard changes</Button>
        <Button onClick={handleSave} className="gap-2 cursor-pointer " disabled={isSaving}>
          <Check className="h-4 w-4" />
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
