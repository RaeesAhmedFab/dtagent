import { useState } from "react";
import {
  Shield,
  Info,
  RefreshCw,
  Plus,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import SettingsCard from "./SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateAPiCredentialsMutation,
  useUpdateAPiCredentialsMutation,
} from "../../redux/Api/adminSetting";

// Hardcoded services shown in the table. `service_name` is the key matched
// against (and sent to) the API; `fields` are the credential `values` inputs
// rendered in the dialog for that specific service.
const CREDENTIALS = [
  {
    service: "OpenAI GPT-4",
    service_name: "Open AI",
    purpose: "Summary + agent responses",
    fields: [{ key: "api_key", label: "API key", placeholder: "sk-xxxxxxxxxxxxxxxx" }],
  },
  {
    service: "AWS SES",
    service_name: "AWS SES",
    purpose: "Email digest dispatch",
    fields: [{ key: "api_key", label: "API key", placeholder: "AKIA…" }],
  },
  {
    service: "Twilio",
    service_name: "Twilio",
    purpose: "SMS alerts (TCPA)",
    fields: [{ key: "api_key", label: "API key", placeholder: "AC…" }],
  },
  {
    service: "YourMembership SSO",
    service_name: "YourMembership SSO",
    purpose: "Member auth (OAuth 2.0)",
    fields: [
      { key: "YM_CLIENT_ID", label: "YM_CLIENT_ID" },
      { key: "YM_APP_ID", label: "YM_APP_ID" },
      { key: "YM_APP_SECRET", label: "YM_APP_SECRET" },
      { key: "YM_API_BASE_URL", label: "YM_API_BASE_URL" },
      { key: "YM_REDIRECT_URI", label: "YM_REDIRECT_URI" },
      { key: "YM_SITE_URL", label: "YM_SITE_URL" },
    ],
  },
  {
    service: "Scraper proxy",
    service_name: "Scraper proxy",
    purpose: "Custom scraper egress",
    fields: [{ key: "api_key", label: "API key", placeholder: "prx_…" }],
  },
];

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

const StatusPill = ({ status }) => {
  const map = {
    active: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Active" },
    inactive: { dot: "bg-gray-400", text: "text-gray-500", label: "Inactive" },
  };
  const s = map[status] || map.inactive;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      <span className={s.text}>{s.label}</span>
    </span>
  );
};

const ApiCredentialsCard = ({ apiCredentials, refetch }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // false → create (POST); true → update (PATCH)
  const [isEditing, setIsEditing] = useState(false);
  // The service row that opened the dialog (drives which fields are shown).
  const [activeRow, setActiveRow] = useState(null);
  const [values, setValues] = useState({});

  const [createCredential, { isLoading: isCreating }] =
    useCreateAPiCredentialsMutation();
  const [updateCredential, { isLoading: isUpdating }] =
    useUpdateAPiCredentialsMutation();

  const isSaving = isCreating || isUpdating;

  // Real credentials from GET /api-creds/, keyed by normalised service_name.
  const results =
    apiCredentials?.data?.results ?? apiCredentials?.data ?? apiCredentials ?? [];
  const list = Array.isArray(results) ? results : results ? [results] : [];
  const apiByService = new Map(
    list
      .filter((r) => r?.service_name)
      .map((r) => [String(r.service_name).trim().toLowerCase(), r])
  );

  const getApiCred = (serviceName) =>
    apiByService.get(String(serviceName).trim().toLowerCase());

  const openDialog = (row, editing) => {
    setActiveRow(row);
    setIsEditing(editing);
    setValues({}); // secrets are never returned by the API — start blank
    setDialogOpen(true);
  };

  const setValueField = (key) => (e) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!activeRow) return;
    const fields = activeRow.fields;

    // Every field for the service is required.
    const cleaned = {};
    for (const f of fields) {
      const v = String(values[f.key] ?? "").trim();
      if (!v) {
        toast.error(`${f.label} is required.`);
        return;
      }
      cleaned[f.key] = v;
    }

    const payload = { service_name: activeRow.service_name, values: cleaned };

    try {
      if (isEditing) {
        // PATCH /api-creds/<service_name>/
        await updateCredential({
          id: activeRow.service_name,
          data: payload,
        }).unwrap();
        toast.success("API credentials updated.");
      } else {
        // POST /api-creds/
        await createCredential(payload).unwrap();
        toast.success("API credentials created.");
      }
      setDialogOpen(false);
      setValues({});
      // Refresh so the table always reflects the latest API response.
      refetch?.();
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.error ||
          "Failed to save API credentials. Please try again."
      );
    }
  };

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
            {CREDENTIALS.map((c) => {
              // If the API has this service, reflect its real data + show the
              // Refresh (update) icon; otherwise show placeholders + Plus.
              const apiCred = getApiCred(c.service_name);
              const exists = !!apiCred;
              const identifier = exists ? apiCred.masked_identifier || "-" : "-";
              const lastRotated = exists
                ? formatDate(apiCred.last_updated) || "-"
                : "-";
              const status = exists && apiCred.status ? "active" : "inactive";

              return (
                <tr key={c.service}>
                  <td className="py-4 pr-4 align-top">
                    <div className="font-semibold text-gray-900">
                      {c.service}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {c.purpose}
                    </div>
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <span className="font-mono text-xs text-gray-600">
                      {identifier}
                    </span>
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <StatusPill status={status} />
                  </td>
                  <td className="py-4 pr-4 align-top font-mono text-xs text-gray-600">
                    {lastRotated}
                  </td>
                  <td className="py-4 align-top">
                    <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                      {exists ? (
                        <button
                          type="button"
                          title="Update key"
                          onClick={() => openDialog(c, true)}
                          className="rounded p-1.5 hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Add key"
                          onClick={() => openDialog(c, false)}
                          className="rounded p-1.5 hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      )}
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
              );
            })}
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

      {/* Shared create/update dialog — fields depend on the selected service */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Update" : "Add"} {activeRow?.service} credentials
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            {activeRow?.fields.map((f) => (
              <div key={f.key} className="grid gap-2">
                <Label htmlFor={`field-${f.key}`} className="text-sm font-medium">
                  {f.label}
                </Label>
                <Input
                  id={`field-${f.key}`}
                  placeholder={f.placeholder || f.label}
                  value={values[f.key] ?? ""}
                  onChange={setValueField(f.key)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="gap-2 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSaving
                ? "Saving…"
                : isEditing
                ? "Update credentials"
                : "Add credentials"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsCard>
  );
};

export default ApiCredentialsCard;
