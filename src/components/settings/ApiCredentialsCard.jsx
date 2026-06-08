import { Shield, Info, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";
import SettingsCard from "./SettingsCard";

const CREDENTIALS = [
  {
    service: "OpenAI GPT-4",
    purpose: "Summary + agent responses",
    identifier: "sk-••••••••••••••••••••••••xxG4",
    status: "active",
    lastRotated: "2026-03-01",
  },
  {
    service: "AWS SES",
    purpose: "Email digest dispatch",
    identifier: "AKIAIOSFODNN7EXAMPLE••••••••",
    status: "active",
    lastRotated: "2026-01-15",
  },
  {
    service: "Twilio",
    purpose: "SMS alerts (TCPA)",
    identifier: "AC••••••••••••••••••••••••72e",
    status: "active",
    lastRotated: "2026-02-10",
  },
  {
    service: "YourMembership SSO",
    purpose: "Member auth (OAuth 2.0)",
    identifier: "ym_oauth_client_••••••••••aa1",
    status: "active",
    lastRotated: "2025-12-04",
  },
  {
    service: "Scraper proxy",
    purpose: "Custom scraper egress",
    identifier: "prx_••••••••••••••••••••••f9b",
    status: "rotate-soon",
    lastRotated: "2025-09-20",
  },
];

const StatusPill = ({ status }) => {
  const isWarn = status === "rotate-soon";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isWarn ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      <span className={isWarn ? "text-amber-600" : "text-emerald-600"}>
        {isWarn ? "Rotate soon" : "Active"}
      </span>
    </span>
  );
};

const ApiCredentialsCard = () => {
  return (
    <SettingsCard
      title="API credentials"
      badge={
        <span className="inline-flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          Stored in AWS Secrets Manager (NF-10)
        </span>
      }
    >
      <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 mb-5">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          All credentials are stored server-side in AWS Secrets Manager and
          injected at runtime (NF-10). Values shown below are masked identifiers
          for reference only — they are never exposed client-side or in source
          code. Use "Open in Secrets Manager" to rotate a key.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-4 font-semibold">Service</th>
              <th className="pb-3 pr-4 font-semibold">Identifier (masked)</th>
              <th className="pb-3 pr-4 font-semibold">Status</th>
              <th className="pb-3 pr-4 font-semibold">Last rotated</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {CREDENTIALS.map((c) => (
              <tr key={c.service}>
                <td className="py-4 pr-4 align-top">
                  <div className="font-semibold text-gray-900">{c.service}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.purpose}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top">
                  <span className="font-mono text-xs text-gray-600">
                    {c.identifier}
                  </span>
                </td>
                <td className="py-4 pr-4 align-top">
                  <StatusPill status={c.status} />
                </td>
                <td className="py-4 pr-4 align-top font-mono text-xs text-gray-600">
                  {c.lastRotated}
                </td>
                <td className="py-4 align-top">
                  <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                    <button
                      type="button"
                      title="Rotate key"
                      className="rounded p-1.5 hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Open in Secrets Manager"
                      className="rounded p-1.5 hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 mt-5">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
        <p className="text-xs text-amber-800 leading-relaxed">
          Scraper proxy key last rotated 2025-09-20 — 8 months ago. Rotation
          recommended every 6 months.
        </p>
      </div>
    </SettingsCard>
  );
};

export default ApiCredentialsCard;
