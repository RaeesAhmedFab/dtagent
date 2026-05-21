import { Label } from "@/components/ui/label";

const FieldLabel = ({ children, htmlFor }) => {
  return (
    <Label 
      htmlFor={htmlFor}
      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block"
    >
      {children}
    </Label>
  );
};

export default FieldLabel;
