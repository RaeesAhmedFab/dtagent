import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SettingsCard from "./SettingsCard";
import FieldLabel from "./FieldLabel";
import SliderField from "./SliderField";
import ToggleRow from "./ToggleRow";

const AISummarizationCard = ({ 
  aiModel, 
  setAiModel, 
  summaryLen, 
  setSummaryLen, 
  paywallDetect, 
  setPaywallDetect 
}) => {
  return (
    <SettingsCard title="AI — article summarization" badge="SU-01 · SU-06">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="ai-model">Model (GPT-4, SU-01)</FieldLabel>
          <Select value={aiModel} onValueChange={setAiModel}>
            <SelectTrigger id="ai-model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo (SRS default)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Used for both article summaries and DTAgent responses. GPT-4 Turbo is the SRS-specified default (§6.3).
          </p>
        </div>

        <SliderField
          label="Target summary length — 2–4 sentences (SU-01)"
          value={summaryLen}
          onChange={setSummaryLen}
          min={40}
          max={200}
          step={10}
          suffix="w"
          description="Current avg: 98 words. SRS target: 2–4 neutral sentences."
        />
      </div>

      <ToggleRow
        title="Exclude paywalled / thin-content articles"
        badge="SU-07 · SHOULD"
        description="Skip articles where body text extraction yields fewer than 100 words — indicates a paywall or redirect page. Prevents poor-quality AI summaries from appearing in the digest."
        checked={paywallDetect}
        onChange={setPaywallDetect}
      />
    </SettingsCard>
  );
};

export default AISummarizationCard;
