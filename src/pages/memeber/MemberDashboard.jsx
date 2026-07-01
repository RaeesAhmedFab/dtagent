import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import TodaysSnapshot from "../../components/TodaysSnapshot";
import All from "./tabs/All";
import Trending from "./tabs/Trending";
import ArticleDetail from "./ArticleDetail";
import { useGetModerationQueueQuery } from "../../redux/Api/adminModerationApi";
import { useDigestFilter } from "./Digestfiltercontext";

const MemberDashboard = () => {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [tab, setTab] = useState("all");
  const { activeFilters } = useDigestFilter();

  const apiFilters = useMemo(() => {
    const filters = { status: "live" };
    if (tab === "trending") {
      filters.ordering = "-read_count";
    }
    if (search.trim()) {
      filters.search = search.trim();
    }
    if (activeFilters.length === 1) {
      filters.category = activeFilters[0].toLowerCase();
    }
    return filters;
  }, [tab, search, activeFilters]);

  const { data: moderationqueue, isLoading } =
    useGetModerationQueueQuery(apiFilters);

  const articles = useMemo(() => {
    const raw = moderationqueue?.data?.results || [];
    return raw.map((item) => {
      const source =
        typeof item.original_article_url === "string"
          ? new URL(item.original_article_url).hostname.replace("www.", "")
          : item.original_article_url || "Unknown";

      const now = new Date();
      const created = new Date(item.created_at);
      const diffMs = now - created;
      const diffMins = Math.floor(diffMs / 60000);
      let time;
      if (diffMins < 1) time = "Just now";
      else if (diffMins < 60) time = `${diffMins}m ago`;
      else if (diffMins < 1440) time = `${Math.floor(diffMins / 60)}h ago`;
      else time = `${Math.floor(diffMins / 1440)}d ago`;

      const sourceKey = source
        .split(".")
        .map((s) => s[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();

      return {
        id: item.id,
        source,
        sourceKey,
        time,
        cats: item.ai_article_categories || [],
        title: item.ai_title || item.original_article_url,
        desc: item.ai_description || "",
        trending: item.status === "live",
        status: item.status,
        ai_article_categories: item.ai_article_categories,
        ai_title: item.ai_title,
        ai_description: item.ai_description,
        original_article_url: item.original_article_url,
        created_at: item.created_at,
        read_count: item.read_count,
        ai_summary_model: item.ai_summary_model,
        remove_reason: item.remove_reason,
        ai_article_language: item.ai_article_language,
        source_name: item.source_name,
      };
    });
  }, [moderationqueue]);

  const handleBack = (article) => {
    if (article && article.id) setDetail(article);
    else setDetail(null);
  };

  const trendingCount = articles.filter((a) => a.status === "live").length;

  return (
    <>
      {!detail && <TodaysSnapshot />}

      <div className="p-4 md:p-6">
        {detail ? (
          <ArticleDetail article={detail} onBack={handleBack} />
        ) : (
          <Tabs value={tab} onValueChange={setTab} defaultValue="all">
            {/* Tab bar + search */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
              <TabsList className="bg-transparent border-b border-gray-200 rounded-none justify-start gap-0 h-auto p-0 w-full md:w-auto">
                <TabsTrigger
                  value="all"
                  className="cursor-pointer rounded-none border-l-0 border-r-0 border-t-0 border-b-2 border-transparent
                    data-[state=active]:border-[#0f2d5c] data-[state=active]:bg-transparent
                    data-[state=active]:text-[#0f2d5c] data-[state=active]:font-semibold
                    px-4 pb-2.5 text-[14px]"
                >
                  All{" "}
                  <span className="ml-1.5 bg-[#0f2d5c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {articles.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="trending"
                  className="cursor-pointer rounded-none border-l-0 border-r-0 border-t-0 border-b-2 border-transparent
                    data-[state=active]:border-[#0f2d5c] data-[state=active]:bg-transparent
                    data-[state=active]:text-[#0f2d5c] data-[state=active]:font-semibold
                    px-4 pb-2.5 text-[14px]"
                >
                  Trending{" "}
                  <span className="ml-1.5 text-gray-500 text-[14px]">
                    {trendingCount}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Search */}
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 gap-2 bg-white w-full md:min-w-[260px] md:w-auto">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search today's digest…"
                  className="border-none shadow-none p-0 h-auto text-[13px] focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Tab content */}
            <TabsContent value="all">
              <All search={search} onArticleClick={setDetail} articles={articles} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="trending">
              <Trending search={search} onArticleClick={setDetail} articles={articles} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default MemberDashboard;