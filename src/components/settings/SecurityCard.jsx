import SettingsCard from "./SettingsCard";
import ToggleRow from "./ToggleRow";

const SecurityCard = () => {
  return (
    <SettingsCard title="Security & access" badge="AU-02 · AU-08 · NF-08–12">
      <div className="space-y-0 divide-y">
        <ToggleRow
          title="YM SSO required for all member logins"
          badge="MUST · AU-02"
          description="YourMembership OAuth 2.0 / SAML 2.0 only. Direct username/password login to DTAgent is disabled. Expired session tokens redirect to YM login (AU-04)."
          checked={true}
          disabled
        />

        <ToggleRow
          title="Admin console uses YM elevated role permissions"
          badge="SHOULD · AU-08"
          description="Admin access is gated on a YM staff role flag passed at SSO login. Identity management stays consolidated in YM — no separate admin credential store in DTAgent."
          checked={true}
          disabled
        />

        <ToggleRow
          title="Sanitize all DTAgent inputs"
          badge="MUST · NF-12"
          description="All member text inputs to the agent are sanitized server-side to prevent prompt injection attacks before forwarding to the OpenAI API."
          checked={true}
          disabled
        />

        <ToggleRow
          title="HTTPS / TLS 1.2+ enforced"
          badge="MUST · NF-08"
          description="HTTP auto-redirected to HTTPS. Session tokens stored server-side only — never in localStorage or URL parameters (NF-09)."
          checked={true}
          disabled
        />
      </div>
    </SettingsCard>
  );
};

export default SecurityCard;
