import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Logo from "@/assets/dtagent.png"
import { Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#eef0f4] h-screen w-full" >
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-sm w-full p-6 ">
          <CardHeader>
            <div className="flex justify-center mb-5 " >
              <img src={Logo} alt="Logo" className="w-15 h-15 text-cente" />
            </div>
            <CardTitle className="flex justify-center text-[22px] mb-2.5" >
              Welcome to DTAgent
            </CardTitle>

            <CardDescription className="text-center text-sm mb-6" >Sign in with your DentalTradeAlliance.org account to read today's AI-curated dental news.</CardDescription>

          </CardHeader>

          <Button onClick={() => navigate('/member/dailydigest')} className="bg-primary text-white hover:bg-[#003165] py-2 px-2 cursor-pointer " >
            Sign in with DTA
          </Button>
          <Button onClick={() => navigate('/admin/dashboard')} className="bg-white text-foreground border border-gray-200 hover:border-[#003165] py-2 px-2 cursor-pointer" >
            <Shield /> Continue as DTA Staff
          </Button>

          <CardFooter className="text-center text-gray-400 mb-5" >
            <p className="text-xs" >Authentication is delegated to <span className="text-primary" >YourMembership</span> in production. This is a mocked SSO bounce for the design prototype.</p>
          </CardFooter>
        </Card>
      </div>



    </div>
  )
}

export default LandingPage