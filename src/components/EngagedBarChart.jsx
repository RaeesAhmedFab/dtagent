import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = {
  labels: ["IDQ", "ADA", "ID", "DrB", "DT", "CX", "DiD", "IDH", "DPH"],
  datasets: [{
    label: "Total reads",
    data: [1431, 1855, 1242, 1108, 977, 612, 590, 504, 421],
    backgroundColor: "#0f2d5c",
    borderRadius: 2,
    borderSkipped: false,
  }],
};

const topLabelsPlugin = {
  id: "topLabels",
  afterDatasetsDraw(chart) {
    const { ctx, data, scales: { x, y } } = chart;
    ctx.save();
    ctx.font = "500 12px sans-serif";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    data.datasets[0].data.forEach((val, i) => {
      ctx.fillText(val.toLocaleString(), x.getPixelForValue(i), y.getPixelForValue(val) - 4);
    });
    ctx.restore();
  },
};

const config = {
  type: "bar",
  data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24 } },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 12 }, color: "#9ca3af" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
        border: { display: false },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} reads` },
      },
    },
  },
  plugins: [topLabelsPlugin],
};

export default function EngagedBarChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, []);

  return (
    <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
      <CardHeader className="pt-5 pb-2 px-6">
        <CardTitle className="text-[15px] font-semibold text-gray-800">
          Most-engaged sources · last 30 days
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-5">
        <div style={{ height: 280 }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  );
}