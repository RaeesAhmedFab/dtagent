import ArticlesCard from "../../components/ArticlesCard";
import CategoryMix from "../../components/CategoryMix";
import DailyActiveMembers from "../../components/DailyActiveMembers";
import SourceHealth from "../../components/SourcehealthCard";
import StatsCards from "../../components/StatsCard"

const generateSparklineData = (trend = "up", points = 10) => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    const change = trend === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    return { x: i, value: parseFloat(value.toFixed(1)) };
  });
};

const statsData = [
  {
    title: "DAILY ACTIVE MEMBERS",
    value: "1,184",
    change: "+8.4% vs last wk",
    trend: "up",
    strokeColor: "#2563eb",
    data: generateSparklineData("up"),
  },
  {
    title: "AGENT QUERIES TODAY",
    value: "3,402",
    change: "+12.1%",
    trend: "up",
    strokeColor: "#16a34a",
    data: generateSparklineData("up"),
  },
  {
    title: "EMAIL OPEN RATE",
    value: "48.2%",
    change: "+1.7 pts",
    trend: "up",
    strokeColor: "#d97706",
    data: generateSparklineData("up"),
  },
  {
    title: "OPENAI TOKENS (24H)",
    value: "1.42M",
    change: "~$58",
    trend: "neutral",
    strokeColor: "#6b7280",
    data: generateSparklineData("neutral"),
  },
];

const AdminDashboard = () => {
  return (
   <div className="grid grid-cols-1 gap-4" >
     <div className="">
      <StatsCards items={statsData} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4" >
      <DailyActiveMembers/>
      <CategoryMix/>
      <ArticlesCard/>
      <SourceHealth/>
    </div>
   </div>
  )
}

export default AdminDashboard