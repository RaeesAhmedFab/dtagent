import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";


const MockData = [
    {
        id: "01",
        title: "ADA releases updated infection-control guidance for 2026 in response to evolving aerosol research",
        badge: "ADA",
        subtitle: "ADA News · Regulations, Clinical",
        price: "3,127"
    },
    {
        id: "02",
        title: "AI-assisted caries detection clears 510(k) hurdle, expected in chairside units by Q4",
        badge: "ID",
        subtitle: "Inside Dentistry · Technology, Clinical",
        price: "3,127"
    },
    {
        id: "03",
        title: "Survey: 62% of hygienists report burnout symptoms, up six points year-over-year",
        badge: "DHQ",
        subtitle: "DentistryIQ · Hygiene, Business",
        price: "3,127"
    },
    {
        id: "04",
        title: "3Shape ships TRIOS 6 with on-scanner AI bite analysis and Wi-Fi 7",
        badge: "DPH",
        subtitle: "Dental Products Hopper · Products, Technology",
        price: "3,127"
    },
    {
        id: "05",
        title: "Silver diamine fluoride coverage expands to 24 state Medicaid programs",
        badge: "DiA",
        subtitle: "Decisions in Dentistry · Clinical, Regulations",
        price: "3,127"
    },
]



const ArticlesCard = () => {
    return (
        <>
            <div className="" >
                <Card>
                    <CardContent className="flex justify-between items-center" >
                        <p className="text-[15px] font-semibold text-gray-800">
                            Most-read articles · today
                        </p>
                        <Button variant="outline" className="cursor-pointer">
                            View all
                        </Button>
                    </CardContent>
                    <CardContent className="p-6 pt-0" >

                        {MockData.map((item, index) => (
                            <div key={item.id} >
                                <div className="flex items-start gap-4 py-3 px-5 hover:bg-gray-100 rounded ">
                                    <span className="text-[13px] text-gray-500 font-medium pt-0.5 min-w-[20px]">{item.id}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-[14px] text-gray-900 font-semibold leading-snug">{item.title}</p>
                                            <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap pt-0.5">{item.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[11px] font-bold bg-[#003165] text-white px-1.5 py-0.5 rounded">{item.badge}</span>
                                            <p className="text-[12px] text-gray-500">{item.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                                {index < MockData.length - 1 && <Separator />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>



    )
}

export default ArticlesCard