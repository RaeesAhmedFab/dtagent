import { Slider } from "@/components/ui/slider";
import FieldLabel from "./FieldLabel";

const SliderField = ({ label, value, onChange, min, max, step, suffix = "", description }) => {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <span className="font-mono text-sm font-semibold text-gray-900 w-12 text-right">
          {value}{suffix}
        </span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};

export default SliderField;
