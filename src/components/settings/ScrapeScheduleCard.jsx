import { Button } from "@/components/ui/button";
import SettingsCard from "./SettingsCard";
import FieldLabel from "./FieldLabel";
import SliderField from "./SliderField";
import ToggleRow from "./ToggleRow";

const ScrapeScheduleCard = ({ 
  scrapeTime, 
  setScrapeTime, 
  maxArticles, 
  setMaxArticles,
  alertLow,
  setAlertLow,
  alertHigh,
  setAlertHigh,
  dualScrape,
  setDualScrape
}) => {
  const times = ['04:00', '04:30', '05:00', '05:30', '06:00'];

  return (
    <SettingsCard title="Scrape schedule" badge="NA-01 · NA-06 · NA-07">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Primary run time EST (default 5:00 AM, NA-01)</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {times.map((t) => (
              <Button
                key={t}
                variant={scrapeTime === t ? "default" : "outline"}
                size="sm"
                onClick={() => setScrapeTime(t)}
              >
                {t} EST
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All sources must complete within 90 min of run start (NF-03) to finish before the 8:00 AM email dispatch.
          </p>
        </div>

        <div>
          <FieldLabel>Daily article target range (NA-06)</FieldLabel>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <SliderField
              label="Alert below (min)"
              value={alertLow}
              onChange={setAlertLow}
              min={10}
              max={100}
              step={5}
            />
            <SliderField
              label="Alert above (max)"
              value={alertHigh}
              onChange={setAlertHigh}
              min={200}
              max={600}
              step={25}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Admin email alert fires when daily count &lt; {alertLow} or &gt; {alertHigh}. SRS defaults: &lt;30 or &gt;400 (NA-06).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4">
        <SliderField
          label="Max articles ingested per run"
          value={maxArticles}
          onChange={setMaxArticles}
          min={50}
          max={500}
          step={25}
          description="SRS target: 100–200/day (NA-06). Current avg: 92/run."
        />

        <div className="flex items-center">
          <ToggleRow
            title="Pre-dispatch re-scrape at 7:45 AM"
            description="Lightweight second pass before the 8:00 AM send to catch late-breaking articles (NA-01)."
            checked={dualScrape}
            onChange={setDualScrape}
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default ScrapeScheduleCard;
