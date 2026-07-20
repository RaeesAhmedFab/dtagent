import {
  ExternalLink,
  Sparkles,
  Share2,
  ChevronLeft,
  Info,
} from "lucide-react";
import { SourceBadge, CatBadge } from "../../components/Digestcomponents";
import { Button } from "@/components/ui/button";
import { AskAgentDrawer } from "../../models/AskAgentDrawer";
import { useState } from "react";
import Loader from "../../components/Loader";

const ArticleDetail = ({
  article,
  onBack,
  relatedArticles = [],
  isLoading = false,
}) => {
  const [AskAgentOpen, setAskAgentOpen] = useState(false);

  const handleOpenAskAgent = () => {
    setAskAgentOpen(true);
    
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader fullScreen={false} size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-[740px]">
      {/* Back */}
      <button
        onClick={() => onBack(null)}
        className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 mb-5 transition-colors cursor-pointer "
      >
        <ChevronLeft size={14} /> Back to digest
      </button>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <SourceBadge sourceKey={article.sourceKey} />
        <span className="text-[13px] text-gray-500">{article.source}</span>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] text-gray-400">{article.time}</span>
        <span className="text-gray-300">·</span>
        {article.cats && article.cats.map((c) => <CatBadge key={c} cat={c} />)}
      </div>

      {/* Title */}
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-5">
        {article.title}
      </h1>

      {/* AI Summary */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl px-5 py-4 mb-5">
        <p className="text-[11px] font-bold text-blue-600 tracking-widest uppercase mb-2 flex items-center gap-1.5">
          <Sparkles size={11} /> AI Summary
        </p>
        <p className="text-[14px] text-gray-700 leading-relaxed">
          {article.desc}
        </p>
      </div>

      {/* Copyright notice */}
      <div className="border border-gray-200 rounded-xl p-4 mb-5 flex items-start gap-2.5">
        <Info size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-gray-600 leading-relaxed">
          <span className="font-semibold">
            Why we don't host the full article
          </span>{" "}
          DTAgent provides AI-generated summaries only. Full article text
          remains with the original publisher to respect copyright. Tap "Read
          original" to view the complete piece on {article.source}.
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Button
          onClick={() => window.open(article.original_article_url, "_blank")}
          className="inline-flex items-center gap-2 hover:bg-[#163d72] cursor-pointer "
        >
          <ExternalLink size={13} /> Read full article on {article.source}
        </Button>
        <Button
          onClick={handleOpenAskAgent}
          variant="outline"
          className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#163d72] cursor-pointer "
        >
          <Sparkles size={13} /> Ask agent about this
        </Button>
        <Button
          variant="outline"
          className="inline-flex items-center gap-2 cursor-pointer"
        >
          <Share2 size={13} /> Share
        </Button>
      </div>

      {/* Related articles */}
      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
        Related from Today's Digest
      </p>
      <div className="flex flex-col gap-2">
        {relatedArticles.length > 0 ? (
          relatedArticles.map((r) => (
            <button
              key={r.id}
              onClick={() => onBack(r)}
              className="text-left  border hover:border-primary rounded-xl px-4 py-3 hover:bg-gray-200/50 transition-colors cursor-pointer "
            >
              <p className="text-[11px] text-gray-400 mb-0.5">
                {r.source} · {r.time}
              </p>
              <p className="text-[13px] font-semibold text-gray-900">
                {r.title}
              </p>
            </button>
          ))
        ) : (
          <p className="text-[13px] text-gray-400">
            No related articles found.
          </p>
        )}
      </div>
      <AskAgentDrawer Open={AskAgentOpen} onClose={setAskAgentOpen} article_id={article.article_id} />
    </div>
  );
};

export default ArticleDetail;
