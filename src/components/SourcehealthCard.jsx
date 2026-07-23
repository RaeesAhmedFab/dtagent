import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const defaultData = [
  { badge: "ID",  name: "Inside Dentistry",          time: "4:58 AM", count: 14, status: "green"  },
  { badge: "IDH", name: "Inside Dental Hygiene",      time: "5:01 AM", count: 6,  status: "green"  },
  { badge: "CX",  name: "Conexiant Dental",           time: "5:02 AM", count: 9,  status: "green"  },
  { badge: "ADA", name: "ADA News",                   time: "5:00 AM", count: 11, status: "green"  },
  { badge: "DA",  name: "The Dental Advisor",         time: "4:51 AM", count: 2,  status: "orange" },
  { badge: "DDH", name: "Dimensions of Dental Hyg.",  time: "Failed",  count: 0,  status: "red"    },
  { badge: "DiD", name: "Decisions in Dentistry",     time: "5:03 AM", count: 7,  status: "green"  },
  { badge: "DIQ", name: "DentistryIQ",                time: "5:00 AM", count: 12, status: "green"  },
];

const statusStyles = {
  green:  { dot: "bg-green-500",  badge: "bg-green-100 text-green-800"  },
  orange: { dot: "bg-orange-400", badge: "bg-orange-100 text-orange-800" },
  red:    { dot: "bg-red-500",    badge: "bg-red-100 text-red-800"      },
};

// Color the row by article count: 0 → red, 1-4 → warning, 5+ → green.
const statusFromCount = (count) => {
  const c = Number(count) || 0;
  if (c === 0) return "red";
  if (c < 5) return "orange";
  return "green";
};

const SourceHealth = ({ data: propData, healthyCount, totalCount }) => {
  const sources = propData || defaultData;
  const healthy = healthyCount ?? sources.filter(s => s.status === "green").length;
  const total = totalCount ?? sources.length;

  return (
    <div className="">
      <Card>
        <CardContent className="flex justify-between items-center pb-4 px-5">
          <p className="text-[15px] font-semibold text-gray-800">Source health</p>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-green-800 bg-green-100 border border-green-300 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {healthy} / {total} healthy
          </span>
        </CardContent>

        <CardContent className="p-0">
          {sources.map((item, index) => {
            const s = statusStyles[statusFromCount(item.count)];
            return (
              <div key={item.badge + index}>
                <div className="flex items-center gap-3 py-3 px-5 hover:bg-gray-100 ">
                  <span className="text-[11px] font-bold bg-[#1e3a6e] text-white px-1.5 py-1 rounded-md min-w-[36px] text-center">
                    {item.badge}
                  </span>
                  <span className="flex-1 text-[13px] text-gray-800">{item.name}</span>
                  <span className={`text-[12px] min-w-[56px] text-right ${item.time === "Failed" ? "text-red-500 font-medium" : "text-gray-400"}`}>
                    {item.time}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium rounded-full px-2.5 py-0.5 min-w-[48px] justify-center ${s.badge}`}>
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    {item.count}
                  </span>
                </div>
                {index < sources.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceHealth;
