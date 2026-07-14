import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fallbackData = [
  {
    title: "Email digest",
    value: "48.2%",
    label: "OPEN RATE (30D)",
    left: "Sent: 7,420",
    right: "CTR: 14.1%",
  },
  {
    title: "SMS digest",
    value: "22.8%",
    label: "CLICK-THROUGH (30D)",
    left: "Sent: 1,944",
    right: "STOP: 12",
  },
  {
    title: "OpenAI usage",
    value: "$1,742",
    label: "THIS MONTH · 41.8M TOKENS",
    left: "Summaries: 64%",
    right: "Agent: 36%",
  },
];

const AnalyticStatsCard = ({ data: propData }) => {
  const items = propData || fallbackData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.title} className="shadow-sm border border-gray-200 rounded-xl">
          <CardContent className="pt-5 pb-4 px-5">
            <p className="text-[13px] font-medium text-gray-700 mb-2">{item.title}</p>
            <p className="text-[34px] font-bold text-gray-900 leading-tight mb-1">{item.value}</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-4">
              {item.label}
            </p>
            <Separator className="mb-3" />
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>{item.left}</span>
              <span>{item.right}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticStatsCard;