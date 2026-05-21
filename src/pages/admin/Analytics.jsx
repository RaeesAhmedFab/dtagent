import AgentTopics from "../../components/AgentTopics";
import AnalyticStatsCard from "../../components/AnalyticStatsCard";
import DailyActiveMembers from "../../components/DailyActiveMembers";
import EngagedBarChart from "../../components/EngagedBarChart";
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
        title: "DAU",
        value: "1,184",
        change: "+8.4%",
        trend: "up",
        strokeColor: "#2563eb",
        data: generateSparklineData("up"),
    },
    {
        title: "WAU",
        value: "3,892",
        change: "+11.0%",
        trend: "up",
        strokeColor: "#16a34a",
        data: generateSparklineData("up"),
    },
    {
        title: "MAU",
        value: "7,540",
        change: "+19.2%",
        trend: "up",
        strokeColor: "#d97706",
        data: generateSparklineData("up"),
    },
    {
        title: "Avg session",
        value: "4m 12s",
        change: "+0:18",
        trend: "up",
        strokeColor: "#6b7280",
        data: generateSparklineData("up"),
    },
];

const Analytics = () => {
    return (
        <>
            <div className="grid grid-cols-1 gap-4" >
                <div className="">
                    <StatsCards items={statsData} show={false} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" />
                </div>
                <div>
                    <DailyActiveMembers />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4" >
                    <EngagedBarChart />
                    <AgentTopics />
                </div>
                <div className="">
                    <AnalyticStatsCard />
                </div>
            </div>

        </>
    )
}

export default Analytics