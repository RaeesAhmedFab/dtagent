import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  cutout: "68%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
      },
    },
  },
};

const defaultColors = [
  "rgb(224, 49, 49)",
  "rgb(25, 113, 194)",
  "rgb(112, 72, 232)",
  "rgb(33, 37, 41)",
  "rgb(47, 158, 68)",
  "rgb(230, 119, 0)",
  "rgb(134, 142, 150)",
];

export default function CategoryMix({ data: propData, total: propTotal }) {
  const labels = propData?.labels || [
    "Clinical",
    "Technology",
    "Regulations",
    "Business",
    "Hygiene",
    "Products",
    "Mainstream",
  ];
  const values = propData?.values || [24, 18, 14, 13, 11, 8, 4];
  const total = propTotal || values.reduce((sum, v) => sum + v, 0);

  // Register/unregister center text plugin dynamically based on total
  useEffect(() => {
    const centerTextPlugin = {
      id: "centerText",
      beforeDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const cx = (chartArea.left + chartArea.right) / 2;
        const cy = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();

        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#1a1a2e";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(total), cx, cy - 8);

        ctx.font = "600 10px sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.letterSpacing = "0.1em";
        ctx.fillText("ARTICLES", cx, cy + 14);

        ctx.restore();
      },
    };

    ChartJS.register(centerTextPlugin);
    return () => {
      ChartJS.unregister(centerTextPlugin);
    };
  }, [total]);

  const data = {
    labels,
    datasets: [
      {
        label: "Articles",
        data: values,
        backgroundColor: defaultColors.slice(0, values.length),
        hoverOffset: 4,
        borderWidth: 1.5,
        borderColor: "#ffffff",
      },
    ],
  };

  const legendItems = labels.map((label, i) => ({
    label,
    value: values[i],
    color: defaultColors[i % defaultColors.length],
  }));

  return (
    <div className="">
      <Card className="w-full h-full shadow-sm border border-gray-200 rounded-xl">
        <CardHeader className="pb-2 pt-2 px-6">
          <CardTitle className="text-[15px] font-semibold text-gray-800">
            Today's category mix
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <div className="flex items-center gap-6">
            {/* Doughnut Chart */}
            <div className="w-[175px] h-[175px] flex-shrink-0">
              <Doughnut data={data} options={options} />
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-[9px] flex-1">
              {legendItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[13px] text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[13px] text-gray-500 font-medium ml-8">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}