import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AISummarizationCard from "@/components/settings/AISummarizationCard";
import ScrapeScheduleCard from "@/components/settings/ScrapeScheduleCard";
import AgentRateLimitsCard from "@/components/settings/AgentRateLimitsCard";
import SecurityCard from "@/components/settings/SecurityCard";
import DangerZoneCard from "@/components/settings/DangerZoneCard";

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
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="">
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

      <SecurityCard />

      <DangerZoneCard />

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline">Discard changes</Button>
        <Button onClick={handleSave} className="gap-2">
          <Check className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
