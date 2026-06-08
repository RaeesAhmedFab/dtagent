import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SettingsCard from "./SettingsCard";
import FieldLabel from "./FieldLabel";
import { useUpdatePasswordMutation } from "@/redux/Api/adminapi";

const PasswordInput = ({ id, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

const UpdatePasswordCard = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < 8;
  const canSubmit =
    current && next.length >= 8 && next === confirm && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await updatePassword({ oldPassword: current, password: next }).unwrap();
      toast.success("Password updated successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (error) {
      console.error("Update password failed:", error);
      toast.error(
        error?.data?.message || "Could not update password. Please try again."
      );
    }
  };

  return (
    <SettingsCard title="Update password" badge="AU-04">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 max-w-sm">
            <FieldLabel htmlFor="current-password">Current password</FieldLabel>
            <PasswordInput
              id="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <PasswordInput
              id="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="At least 8 characters"
            />
            {tooShort && (
              <p className="text-xs text-red-600 mt-2">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="confirm-password">
              Confirm new password
            </FieldLabel>
            <PasswordInput
              id="confirm-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
            />
            {mismatch && (
              <p className="text-xs text-red-600 mt-2">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <Button type="submit" size="sm" disabled={!canSubmit} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <KeyRound className="h-3.5 w-3.5" />
            )}
            Update password
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
};

export default UpdatePasswordCard;
