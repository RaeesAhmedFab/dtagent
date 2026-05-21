import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "92", label: "NEW ARTICLES"    },
  { value: "11", label: "SOURCES TODAY"   },
  { value: "7",  label: "CATEGORIES"      },
  { value: "3",  label: "TRENDING TOPICS" },
];

const TodaysSnapshot = () => {
  return (
    <Card className="w-full rounded-xl border-0 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d2b5e 0%, #1a4a8a 60%, #1e5499 100%)" }}>
      <CardContent className="px-7 pt-6 pb-5">

        {/* Label */}
        <p className="text-[11px] font-semibold tracking-widest uppercase text-blue-300 mb-2.5">
          Today's Snapshot · Wednesday, May 6, 2026
        </p>

        {/* Headline */}
        <p className="text-[22px] font-semibold text-white leading-snug mb-5 max-w-xl">
          Infection-control rules tighten as AI caries detection
          clears the FDA — your morning brief is in.
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 mb-4" />

        {/* Stats row */}
        <div className="flex gap-9 flex-wrap">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[20px] font-bold text-white leading-tight mb-0.5">{s.value}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-300">{s.label}</p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
};

export default TodaysSnapshot;