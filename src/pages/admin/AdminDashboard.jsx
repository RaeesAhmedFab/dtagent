import ArticlesCard from "../../components/ArticlesCard";
import CategoryMix from "../../components/CategoryMix";
import DailyActiveMembers from "../../components/DailyActiveMembers";
import SourceHealth from "../../components/SourcehealthCard";
import StatsCards from "../../components/StatsCard"
import { useGetCategoryMixTodayQuery, useGetSourceHealthTodayQuery } from "../../redux/Api/adminapi";

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
  const { data: categoryMixData } = useGetCategoryMixTodayQuery();
  const { data: sourceHealthData } = useGetSourceHealthTodayQuery();

  // Parse category mix data  - response: { status_code, data: { categories: [{ category, label, count }], total_articles } }
  const catData = categoryMixData?.data;
  const categoryMix = catData?.categories
    ? {
        labels: catData.categories.map((c) => c.label),
        values: catData.categories.map((c) => c.count),
      }
    : undefined;

  const categoryTotal = catData?.total_articles || categoryMix?.values?.reduce((sum, v) => sum + v, 0);

  // Parse source health data - response: { status_code, data: { sources: [...], healthy_count, total_count } }
  const srcData = sourceHealthData?.data;
  const sourceHealthSources = Array.isArray(srcData?.sources)
    ? srcData.sources.map((s) => ({
        badge: s.short_label,
        name: s.source_name,
        time: s.end_time
          ? new Date(s.end_time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : s.status === "running"
          ? "Running"
          : s.status === "failed"
          ? "Failed"
          : "-",
        count: s.article_count ?? 0,
        status: s.is_healthy ? "green" : "red",
      }))
    : undefined;
  const sourceHealthyCount = srcData?.healthy_count;
  const sourceTotalCount = srcData?.total_count;

  return (
   <div className="grid grid-cols-1 gap-4" >
     <div className="">
      <StatsCards items={statsData} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4" >
      <DailyActiveMembers/>
      <CategoryMix data={categoryMix} total={categoryTotal} />
      <ArticlesCard/>
      <SourceHealth data={sourceHealthSources} healthyCount={sourceHealthyCount} totalCount={sourceTotalCount} />
    </div>
   </div>
  )
}

export default AdminDashboard