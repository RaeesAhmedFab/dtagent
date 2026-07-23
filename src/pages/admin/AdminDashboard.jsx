import { useMemo } from "react";
import ArticlesCard from "../../components/ArticlesCard";
import CategoryMix from "../../components/CategoryMix";
import DailyActiveMembers from "../../components/DailyActiveMembers";
import SourceHealth from "../../components/SourcehealthCard";
import StatsCards from "../../components/StatsCard"
import { useGetCategoryMixTodayQuery, useGetSourceHealthTodayQuery } from "../../redux/Api/adminapi";
import { useGetStaffDashboardQuery } from "../../redux/Api/analyticsApi";

const generateSparklineData = (trend = "up", points = 10) => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    const change = trend === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    return { x: i, value: parseFloat(value.toFixed(1)) };
  });
};

// Maps each staff-dashboard card key to its presentation.
// response.data shape: { [key]: { count, percentage } } where count/percentage
// may be the string "N/A". `isPercent` renders the count itself as a rate.
const STAT_CARDS = [
  { key: "daily_active_members", title: "DAILY ACTIVE MEMBERS", strokeColor: "#2563eb", isPercent: false },
  { key: "agent_queries_today", title: "AGENT QUERIES TODAY", strokeColor: "#16a34a", isPercent: false },
  { key: "email_open_rate", title: "EMAIL OPEN RATE", strokeColor: "#d97706", isPercent: true },
  { key: "openai_tokens_24h", title: "OPENAI TOKENS (24H)", strokeColor: "#6b7280", isPercent: false },
];

const isNA = (v) => v == null || v === "N/A";

const formatValue = (count, isPercent) => {
  if (isNA(count)) return "N/A";
  if (isPercent) return `${count}%`;
  const num = Number(count);
  return Number.isFinite(num) ? num.toLocaleString() : String(count);
};

const formatChange = (percentage) => {
  if (isNA(percentage)) return "—";
  const num = Number(percentage);
  if (!Number.isFinite(num)) return String(percentage);
  const sign = num > 0 ? "+" : "";
  return `${sign}${percentage}%`;
};

const trendFrom = (percentage) => {
  const num = Number(percentage);
  if (isNA(percentage) || !Number.isFinite(num) || num === 0) return "neutral";
  return num > 0 ? "up" : "down";
};

const AdminDashboard = () => {
  const { data: categoryMixData } = useGetCategoryMixTodayQuery();
  const { data: sourceHealthData } = useGetSourceHealthTodayQuery();
  const { data: staffDashboardData } = useGetStaffDashboardQuery();

  // Build stats cards from the staff-dashboard endpoint. Sparklines are kept
  // as decorative placeholders (the API returns no series) and memoized so
  // they stay stable across re-renders.
  const dash = staffDashboardData?.data;
  const statsData = useMemo(
    () =>
      STAT_CARDS.map((card) => {
        const stat = dash?.[card.key];
        const trend = trendFrom(stat?.percentage);
        return {
          title: card.title,
          value: stat ? formatValue(stat.count, card.isPercent) : "—",
          change: stat ? formatChange(stat.percentage) : "",
          trend,
          strokeColor: card.strokeColor,
          // data: generateSparklineData(trend === "down" ? "down" : trend === "up" ? "up" : "neutral"),
        };
      }),
    [dash]
  );

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