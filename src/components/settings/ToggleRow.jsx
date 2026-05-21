import { Switch } from "@/components/ui/switch";

const ToggleRow = ({ title, description, badge, checked, onChange, disabled = false }) => {
  return (
    <div className="flex items-center gap-3 py-3 border-t first:border-t-0">
      <div className="flex-1">
        <div className="font-medium text-sm flex items-center gap-2">
          {title}
          {badge && (
            <span className="text-xs font-normal text-muted-foreground">{badge}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
};

export default ToggleRow;
