import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  { date: "Apr 30", value: 420 },
  { date: "May 1",  value: 435 },
  { date: "May 2",  value: 430 },
  { date: "May 3",  value: 460 },
  { date: "May 4",  value: 445 },
  { date: "May 5",  value: 465 },
  { date: "May 6",  value: 490 },
];

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#ffffff"
      stroke="#1e3a6e"
      strokeWidth={2}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-[#1e3a6e] font-medium">{payload[0].value} members</p>
      </div>
    );
  }
  return null;
};

export default function DailyActiveMembers() {
  const [range, setRange] = useState("90");

  return (
    <div className="">
      <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-2 px-6">
          <CardTitle className="text-[15px] font-semibold text-gray-800">
            Daily active members · last 7 days
          </CardTitle>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[110px] h-8 text-sm border-gray-300 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-4 pb-5">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b8c8e8" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#dde6f4" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#f0f0f0"
                strokeDasharray=""
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                dy={8}
              />

              <YAxis hide />

              <Tooltip content={<CustomTooltip />} cursor={false} />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#1e3a6e"
                strokeWidth={2}
                fill="url(#areaGradient)"
                dot={<CustomDot />}
                activeDot={{ r: 5, fill: "#1e3a6e", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}