import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MockData = [
  { id: "01", topic: "Infection control / OSHA", category: "REGULATIONS", count: 412 },
  { id: "02", topic: "AI / digital scanning",    category: "TECHNOLOGY",  count: 308 },
  { id: "03", topic: "Implant survival data",    category: "CLINICAL",    count: 244 },
  { id: "04", topic: "DSO market activity",      category: "BUSINESS",    count: 198 },
  { id: "05", topic: "Hygienist burnout",        category: "HYGIENE",     count: 167 },
  { id: "06", topic: "Medicaid SDF coverage",    category: "REGULATIONS", count: 132 },
  { id: "07", topic: "Teledentistry parity",     category: "REGULATIONS", count: 98  },
];

const categoryStyles = {
  REGULATIONS: "text-violet-600 border-violet-300 bg-violet-50",
  TECHNOLOGY:  "text-blue-700  border-blue-300   bg-blue-50",
  CLINICAL:    "text-pink-700  border-pink-300   bg-pink-50",
  BUSINESS:    "text-gray-700  border-gray-300   bg-gray-50",
  HYGIENE:     "text-teal-700  border-teal-300   bg-teal-50",
};

const AgentTopics = () => {
  return (
    <Card>
      <CardContent className="pt-5 pb-2 px-5">
        <p className="text-[15px] font-semibold text-gray-800 mb-3">
          Most-queried agent topics
        </p>

        {MockData.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-center gap-3 py-2.5">
              <span className="text-[12px] text-gray-400 font-medium min-w-[20px]">
                {item.id}
              </span>
              <span className="flex-1 text-[13px] text-gray-800">
                {item.topic}
              </span>
              <span className={`text-[11px] font-semibold border rounded-md px-2.5 py-0.5 ${categoryStyles[item.category]}`}>
                {item.category}
              </span>
              <span className="text-[13px] text-gray-500 min-w-[32px] text-right">
                {item.count}
              </span>
            </div>
            {index < MockData.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AgentTopics;