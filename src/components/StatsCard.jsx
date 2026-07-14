import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const TrendIcon = ({ trend }) => {
  if (trend === "up")
    return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "down")
    return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

const trendColors = {
  up: "text-emerald-600",
  down: "text-red-500",
  neutral: "text-gray-500",
};

export default function StatsCards({ className, items = [], show = true }) {
  return (
    <div className={className}>
      {items.map((stat, index) => (
        <Card
          key={index}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <CardContent className="p-5 flex flex-col">
            {/* Title */}
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
              {stat.title}
            </p>

            {/* Value */}
            <p className="text-3xl font-bold text-gray-900 mb-3">
              {stat.value}
            </p>

            {/* Trend badge */}
            <div
              className={`flex items-center gap-1 text-xs font-medium mb-4 ${trendColors[stat.trend]}`}
            >
              <TrendIcon trend={stat.trend} />
              <span>{stat.change}</span>
            </div>

            {/* Sparkline */}
            {show && stat.data && (
              <div className="-mx-5 -mb-5 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stat.data}>
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "11px",
                        padding: "4px 8px",
                      }}
                      itemStyle={{ color: stat.strokeColor }}
                      cursor={false}
                      formatter={(v) => [v, ""]}
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={stat.strokeColor}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, fill: stat.strokeColor }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}