import { useState } from "react";
import AgentTopics from "../../components/AgentTopics";
import AnalyticStatsCard from "../../components/AnalyticStatsCard";
import DailyActiveMembers from "../../components/DailyActiveMembers";
import EngagedBarChart from "../../components/EngagedBarChart";
import StatsCards from "../../components/StatsCard";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAnalyticsCardsQuery,
  useGetDauTrendQuery,
  useGetSourceEngagementQuery,
  useGetAgentTopicsQuery,
} from "../../redux/Api/analyticsApi";

const generateSparklineData = (trend = "up", points = 10) => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    const change = trend === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    return { x: i, value: parseFloat(value.toFixed(1)) };
  });
};

const fallbackStats = [
  {
    title: "DAU",
    value: "0",
    change: "0.00%",
    trend: "neutral",
    strokeColor: "#2563eb",
    data: generateSparklineData("neutral"),
  },
  {
    title: "WAU",
    value: "0",
    change: "0.00%",
    trend: "neutral",
    strokeColor: "#16a34a",
    data: generateSparklineData("neutral"),
  },
  {
    title: "MAU",
    value: "0",
    change: "0.00%",
    trend: "neutral",
    strokeColor: "#d97706",
    data: generateSparklineData("neutral"),
  },
  {
    title: "Avg session",
    value: "0m 00s",
    change: "+0:00",
    trend: "neutral",
    strokeColor: "#6b7280",
    data: generateSparklineData("neutral"),
  },
];

const Analytics = () => {
  const [dauDays, setDauDays] = useState("7");

  const {
    data: cardsData,
    isLoading: cardsLoading,
    isError: cardsError,
    error: cardsErr,
  } = useGetAnalyticsCardsQuery();

  const {
    data: dauData,
    isLoading: dauLoading,
    isError: dauError,
    error: dauErr,
  } = useGetDauTrendQuery(dauDays);

  const {
    data: sourceData,
    isLoading: sourceLoading,
    isError: sourceError,
    error: sourceErr,
  } = useGetSourceEngagementQuery();

  const {
    data: agentData,
    isLoading: agentLoading,
    isError: agentError,
    error: agentErr,
  } = useGetAgentTopicsQuery();

  const handleRangeChange = (range) => {
    setDauDays(range);
  };

  const isPageLoading = cardsLoading || dauLoading || sourceLoading || agentLoading;
  const pageError = cardsError || dauError || sourceError || agentError;
  const pageErrData = cardsErr || dauErr || sourceErr || agentErr;

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-600">
          {pageErrData?.data?.message || "Failed to load analytics data"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // ── Stats Cards: /analytics/cards/ ──
  // API shape: { dau: {value, change_pct}, wau: {value, change_pct}, mau: {value, change_pct}, avg_session: {value_seconds, display, change_seconds, change_display} }
  const apiCards = cardsData?.data;
  const statsItems = apiCards
    ? [
        {
          title: "DAU",
          value: apiCards.dau?.value?.toLocaleString() ?? "0",
          change: `${apiCards.dau?.change_pct ?? "0.00"}%`,
          trend: parseFloat(apiCards.dau?.change_pct || "0") > 0 ? "up" : parseFloat(apiCards.dau?.change_pct || "0") < 0 ? "down" : "neutral",
          strokeColor: "#2563eb",
          data: generateSparklineData("neutral"),
        },
        {
          title: "WAU",
          value: apiCards.wau?.value?.toLocaleString() ?? "0",
          change: `${apiCards.wau?.change_pct ?? "0.00"}%`,
          trend: parseFloat(apiCards.wau?.change_pct || "0") > 0 ? "up" : parseFloat(apiCards.wau?.change_pct || "0") < 0 ? "down" : "neutral",
          strokeColor: "#16a34a",
          data: generateSparklineData("neutral"),
        },
        {
          title: "MAU",
          value: apiCards.mau?.value?.toLocaleString() ?? "0",
          change: `${apiCards.mau?.change_pct ?? "0.00"}%`,
          trend: parseFloat(apiCards.mau?.change_pct || "0") > 0 ? "up" : parseFloat(apiCards.mau?.change_pct || "0") < 0 ? "down" : "neutral",
          strokeColor: "#d97706",
          data: generateSparklineData("neutral"),
        },
        {
          title: "Avg session",
          value: apiCards.avg_session?.display || "0m 00s",
          change: apiCards.avg_session?.change_display || "+0:00",
          trend: (apiCards.avg_session?.change_seconds || 0) > 0 ? "up" : (apiCards.avg_session?.change_seconds || 0) < 0 ? "down" : "neutral",
          strokeColor: "#6b7280",
          data: generateSparklineData("neutral"),
        },
      ]
    : fallbackStats;

  // ── DAU Trend Chart: /analytics/dau-trend/?days=7 ──
  // API shape: { days, start_date, end_date, points: [{date, date_display, dau}] }
  // Chart expects: [{date, value}]
  const dauChartData = (() => {
    const raw = dauData?.data;
    if (Array.isArray(raw?.points)) {
      return raw.points.map((p) => ({
        date: p.date_display || p.date,
        value: p.dau,
      }));
    }
    return null;
  })();

  // ── Source Engagement Bar Chart: /analytics/source-engagement/ ──
  // API shape: { snapshot_date, period_days, sources: [{source_id, label, source_name, count}] }
  const sourceChartData = sourceData?.data;
  const barChartData = sourceChartData?.sources
    ? {
        labels: sourceChartData.sources.map((s) => s.source_name),
        values: sourceChartData.sources.map((s) => s.count),
      }
    : undefined;

  // ── Agent Topics: /analytics/agent-topics/ ──
  // API shape: { snapshot_date, period_days, topics: [{topic, category, count}] }
  const agentTopics = (() => {
    const raw = agentData?.data;
    if (Array.isArray(raw?.topics)) return raw.topics;
    return null;
  })();

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="">
          <StatsCards
            items={statsItems}
            show={false}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          />
        </div>
        <div>
          <DailyActiveMembers
            data={dauChartData}
            onRangeChange={handleRangeChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          <EngagedBarChart data={barChartData} />
          <AgentTopics data={agentTopics} />
        </div>
        <div className="">
          <AnalyticStatsCard />
        </div>
      </div>
    </>
  );
};

export default Analytics;