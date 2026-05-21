import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import { Mail, Phone } from "lucide-react";
import EmailTemplatePreview from "../../components/EmailTemplatePreview";
import { Separator } from "@/components/ui/separator";
const Dispatchschedule = [
    {
        icon: <Mail />,
        title: "Daily email digest",
        description: "AWS SES · 8:00 AM EST · 5,842 opted-in"
    },
    {
        icon: <Phone />,
        title: "Daily SMS alert",
        description: "Twilio · 8:00 AM EST · 1,944 opted-in (TCPA-compliant)",
    },
    {
        icon: <Mail />,
        title: "Weekly roundup (Friday)",
        description: "SES · 9:00 AM EST · 1,231 opted-in"
    }
]

const Lastdelivery = [
    {
        title: "Email — Daily",
        price: "5,820 sent",
        subdes: "22 bounced",
        status: "green"
    },
    {
        title: "SMS — Daily",
        price: "1,941 sent",
        subdes: "3 retried",
        status: "green"
    },
    {
        title: "STOP replies",
        price: "2 received",
        subdes: "auto opt-out",
        status: "orange"
    },
]

const statusStyles = {
    green: { dot: "bg-green-500", badge: "bg-green-100 text-green-800" },
    orange: { dot: "bg-gray-400", badge: "bg-gray-200 text-gray-800" },
};


const AlertSystem = () => {

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg" >Dispatch schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" >
                            {Dispatchschedule.map((item, index) => (

                                <div key={index} className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50">
                                    <div className=" mt-0.5" >
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <Switch defaultChecked className="ml-auto" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg" >Last 24h delivery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" >
                            {Lastdelivery.map((item, index) => {
                                const s = statusStyles[item.status];
                                return (
                                    <>
                                    <div key={index} className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50">
                                        <div className="flex justify-between items-center w-full">
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium rounded-full px-2.5 py-0.5 min-w-[48px] justify-center ${s.badge}`}>
                                                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                                {item.price}
                                            </span>
                                            <p className="text-sm text-gray-500">{item.subdes}</p>
                                        </div>
                                      
                                    </div>
                                      {index < Lastdelivery.length - 1 && <Separator />}
                                    </>
                                )

                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="mt-5" >
                <EmailTemplatePreview/>
            </div>
        </>
    )
}

export default AlertSystem