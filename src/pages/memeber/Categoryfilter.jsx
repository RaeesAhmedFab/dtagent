import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";

const CATEGORIES = [
  { key: "technology",  label: "Technology",  count: 2, dot: "bg-blue-600"   },
  { key: "hygiene",     label: "Hygiene",      count: 2, dot: null            },
  { key: "products",    label: "Products",     count: 1, dot: "bg-orange-500" },
  { key: "regulation", label: "Regulations",  count: 4, dot: null            },
  { key: "clinical",    label: "Clinical",     count: 5, dot: "bg-red-500"    },
  { key: "business",    label: "Business",     count: 4, dot: null            },
  { key: "mainstream",  label: "Mainstream",   count: 0, dot: "bg-gray-600"   },
];

const JOKES = [
  { question: "What do you call a dentist who doesn't like tea?", answer: "Denis!" },
  { question: "Why did the king go to the dentist?", answer: "To get his teeth crowned!" },
];

// ─── FilterChips (shown above article list) ───────────────────────
export const FilterChips = ({ filters, onRemove, onClear }) => {
  if (!filters.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <span className="text-[12px] text-gray-500">Filtered by:</span>
      {filters.map((f) => (
        <Badge
          key={f}
          variant="outline"
          className="text-[11px] font-semibold text-[#0f2d5c] border-[#0f2d5c]/40 bg-blue-50 gap-1.5 px-2.5 py-1 rounded-md"
        >
          {f}
          <button onClick={() => onRemove(f)} className="hover:text-red-500 transition-colors">
            <X size={10} strokeWidth={2.5} />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClear}
        className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
      >
        Clear
      </button>
    </div>
  );
};

// ─── CategoryFilter sidebar ───────────────────────────────────────
const CategoryFilter = ({ onFiltersChange }) => {
  const [selected,     setSelected]     = useState([]);
  const [jokeRevealed, setJokeRevealed] = useState(false);
  const joke = JOKES[0];

  const toggle = (key) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    setSelected(next);
    onFiltersChange?.(next);
  };

  return (
    <div className="w-[190px] flex-shrink-0 flex flex-col gap-4">

      {/* Joke of the day */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
        <p className="text-[10px] font-bold tracking-widest text-cyan-600 uppercase mb-2 flex items-center gap-1.5">
          😄 Joke of the day
        </p>
        <p className="text-[13px] text-gray-700 leading-snug mb-3">
          {joke.question}
        </p>
        {jokeRevealed && (
          <p className="text-[12px] text-cyan-700 font-semibold mb-3 italic">
            {joke.answer}
          </p>
        )}
        <div className="flex gap-2 flex-wrap">
          {!jokeRevealed && (
            <Button
              variant="outline" size="sm"
              onClick={() => setJokeRevealed(true)}
              className="text-[11px] h-7 px-3 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-white"
            >
              Reveal
            </Button>
          )}
          <Button
            variant="outline" size="sm"
            className="text-[11px] h-7 px-3 border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-white gap-1"
          >
            <Sparkles size={10} /> Ask agent
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1 px-1">
          Categories
        </p>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = selected.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => toggle(cat.key)}
                className={`flex items-center gap-2.5 px-2.5 py-[9px] text-left transition-all border-l-[3px] rounded-r-md
                  ${isActive
                    ? "border-l-[#0f2d5c] bg-blue-50/80"
                    : "border-l-transparent hover:bg-gray-50"
                  }`}
              >
                {cat.dot
                  ? <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cat.dot}`} />
                  : <span className="w-2 h-2 flex-shrink-0" />
                }
                <span className={`flex-1 text-[13px] ${isActive ? "text-[#0f2d5c] font-semibold" : "text-gray-700"}`}>
                  {cat.label}
                </span>
                <span className={`text-[11px] min-w-[20px] text-center rounded-full
                  ${isActive
                    ? "bg-[#0f2d5c] text-white px-1.5 py-0.5 text-[10px] font-bold"
                    : "text-gray-400"
                  }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CategoryFilter;