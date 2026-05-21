import { Card, CardContent,CardHeader, CardTitle,CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const account=[
    {
        name:"Dr. Diana Kapoor",
        email:"d.kapoor@bayareaperio.com",
        Membertier:"Premier",
        Authentication:"Your Membership SSO · OAuth 2.0",
        Membersince:"March 2019",
    }
]


const MemberSettings = () => {
  return (
    <>
    <Card  className="w-full max-w-5xl" >
        <CardHeader>
            <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
        {account.map((item,index)=>(
            <div key={index} className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <span className="font-semibold">Name:</span>
                    <span>{item.name}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>{item.email}</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="font-semibold">Member tier:</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{item.Membertier}</Badge>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Authentication:</span>
                    <span>{item.Authentication}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Member since:</span>
                    <span>{item.Membersince}</span>
                </div>
            </div>
        ))}
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground">
                Profile data is managed in your DTA member account. <span className="text-primary/50 hover:text-primary underline cursor-pointer" >Manage on dentaltradealliance.org →</span>.
            </p>
        </CardFooter>
    </Card>
    <Card className="w-full max-w-5xl mt-6 bg-amber-50/30" >
        <CardContent className="flex justify-between items-center" >Signed in as Dr. Diana Kapoor
            <Button variant="outline" className="hover:border hover:border-primary cursor-pointer" >Sign out</Button>
        </CardContent>
        
    </Card>
    </>
  )
}

export default MemberSettings