import { useSelector } from "react-redux";
import { Mail, BadgeCheck, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SettingsCard from "./SettingsCard";
import FieldLabel from "./FieldLabel";
import { selectUser } from "@/redux/apiSlice/authSlice";

const ProfileCard = () => {
  const user = useSelector(selectUser);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isActive = user?.status === "active";

  return (
    <SettingsCard title="Profile" badge={user?.role?.toUpperCase()}>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003165] text-lg font-semibold text-white">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {user?.name || "—"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
              <span className={isActive ? "text-emerald-600" : "text-gray-500"}>
                {isActive ? "Active" : user?.status || "Inactive"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Building2 className="h-3.5 w-3.5" />
            {user?.orgName || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
          <Input id="profile-name" defaultValue={user?.name || ""} />
        </div>

        <div>
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <div className="relative">
            <Input
              id="profile-email"
              type="email"
              defaultValue={user?.email || ""}
              readOnly
              className="pr-9"
            />
            {user?.isEmailVerified && (
              <BadgeCheck className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            {user?.isEmailVerified
              ? "Email verified"
              : "Email not verified"}
          </p>
        </div>

        <div>
          <FieldLabel htmlFor="profile-contact">Contact number</FieldLabel>
          <Input id="profile-contact" defaultValue={user?.contact || ""} />
        </div>

        <div>
          <FieldLabel htmlFor="profile-role">Role</FieldLabel>
          <Input
            id="profile-role"
            defaultValue={user?.role || ""}
            readOnly
            className="capitalize"
          />
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <Button size="sm">Save profile</Button>
      </div>
    </SettingsCard>
  );
};

export default ProfileCard;
