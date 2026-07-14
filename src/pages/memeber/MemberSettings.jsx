import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "../../redux/Api/adminapi";
import Loader from "../../components/Loader";

const MemberSettings = () => {
  const { data, isLoading, error } = useGetMeQuery();

  const me = data?.data || data || {};
  const fullName = me.full_name || me.name || "—";
  const email = me.email || "—";
  const memberTier = me.ym_tier || "—";
  const memberSince = me.date_joined
    ? new Date(me.date_joined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "—";

  return (
    <>
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <><Loader fullScreen={false} size={40} /></>}
          {error && <p className="text-sm text-red-600">Failed to load account details.</p>}
          {!isLoading && !error && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="font-semibold">Name:</span>
                <span>{fullName}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">Member tier:</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{memberTier}</Badge>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Authentication:</span>
                <span>Your Membership SSO · OAuth 2.0</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Member since:</span>
                <span>{memberSince}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Profile data is managed in your DTA member account. <span className="text-primary/50 hover:text-primary underline cursor-pointer">Manage on dentaltradealliance.org →</span>.
          </p>
        </CardFooter>
      </Card>
      <Card className="w-full max-w-5xl mt-6 bg-amber-50/30">
        <CardContent className="flex justify-between items-center">
          Signed in as {fullName}
          <Button variant="outline" className="hover:border hover:border-primary cursor-pointer">Sign out</Button>
        </CardContent>
      </Card>
    </>
  )
}

export default MemberSettings