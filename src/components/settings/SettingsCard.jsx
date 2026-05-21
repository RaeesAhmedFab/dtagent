import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsCard = ({ title, badge, children, variant = "default" }) => {
  const borderClass = variant === "danger" ? "border-red-200" : "";
  const titleClass = variant === "danger" ? "text-red-600" : "";

  return (
    <Card className={`mb-4 ${borderClass}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${titleClass}`}>{title}</CardTitle>
          {badge && (
            <span className="text-xs text-muted-foreground">{badge}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SettingsCard;
