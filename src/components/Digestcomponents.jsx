import { BookOpen, Sparkles, ExternalLink } from "lucide-react";
import { TRENDING_CATS, TOP_SOURCES, CAT_STYLES } from "../mockdata/Digestdata";
import { Card } from "@/components/ui/card";
// ─── Category badge ───────────────────────────────────────────────
export const CatBadge = ({ cat }) => (
  <span className={`text-[11px] font-semibold border rounded px-2 py-0.5 ${CAT_STYLES[cat] || "text-gray-600 border-gray-200 bg-gray-50"}`}>
    {cat}
  </span>
);

// ─── Source badge ─────────────────────────────────────────────────
export const SourceBadge = ({ sourceKey }) => (
  <span className="text-[11px] font-bold bg-[#0f2d5c] text-white px-1.5 py-0.5 rounded min-w-[28px] text-center inline-block">
    {sourceKey}
  </span>
);

// ─── Article action row ───────────────────────────────────────────
export const ArticleActions = ({ source, originalUrl }) => (
  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[12px] text-gray-400">
    <button className="inline-flex items-center gap-1.5 hover:text-gray-600 transition-colors">
      <BookOpen size={12} /> Read summary
    </button>
    <button className="inline-flex items-center gap-1.5 hover:text-gray-600 transition-colors">
      <Sparkles size={12} /> Ask agent about this
    </button>
    <a
      href={originalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-auto inline-flex items-center gap-1 text-[#0f2d5c] font-medium hover:underline cursor-pointer"
    >
      Read original <ExternalLink size={11} />
    </a>
  </div>
);

// ─── Regular article card ─────────────────────────────────────────
export const ArticleCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article)}
    className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
  >
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <SourceBadge sourceKey={article.sourceKey} />
      <span className="text-[12px] text-gray-400">{article.source}</span>
      <span className="text-gray-300">·</span>
      <span className="text-[12px] text-gray-400">{article.time}</span>
      {article.cats.map(c => <CatBadge key={c} cat={c} />)}
    </div>
    <h3 className="text-[14px] md:text-[15px] font-semibold text-gray-900 mb-2 leading-snug">{article.title}</h3>
    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 mb-3">{article.desc}</p>
    <ArticleActions source={article.source} originalUrl={article.original_article_url} />
  </div>
);

// ─── Featured article card (full-width highlighted) ───────────────
export const FeaturedCard = ({ article, onClick }) => (
  <div
    onClick={() => onClick(article)}
    className="border-2 border-blue-200 rounded-xl p-4 md:p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all mb-5"
    style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #fff 100%)" }}
  >
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <SourceBadge sourceKey={article.sourceKey} />
      <span className="text-[12px] text-gray-400">{article.source}</span>
      <span className="text-gray-300">·</span>
      <span className="text-[12px] text-gray-400">{article.time}</span>
      {article.cats.map(c => <CatBadge key={c} cat={c} />)}
    </div>
    <h2 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-2.5 leading-snug">{article.title}</h2>
    <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{article.desc}</p>
    <ArticleActions source={article.source} originalUrl={article.original_article_url} />
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────
export const DigestSidebar = () => (
  <div className="w-full lg:w-[220px] flex-shrink-0 flex flex-col gap-6">
    {/* Trending categories */}
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-3">
        Trending Categories
      </p>
      <Card className="flex flex-col gap-2 p-3">
        {TRENDING_CATS.map(c => (
          <div key={c.name} className="flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors rounded px-2 py-1 ">
            <span className={`text-[11px] font-semibold border rounded px-2 py-0.5 ${c.style}`}>
              {c.name}
            </span>
            <span className="text-[12px] text-gray-400 font-medium">{c.count}</span>
          </div>
        ))}
      </Card>
    </div>

    {/* Top sources */}
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-3">
        Top Sources Today
      </p>
      <Card className="flex flex-col gap-2 p-3">
        {TOP_SOURCES.map(s => (
          <div key={s.name} className="flex items-center justify-between">
            <span className="text-[13px] text-gray-700">{s.name}</span>
            <span className="text-[12px] text-gray-400 font-medium">{s.count}</span>
          </div>
        ))}
      </Card>
    </div>
  </div>
);
