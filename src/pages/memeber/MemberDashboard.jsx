import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import TodaysSnapshot from "../../components/TodaysSnapshot";
import All from "./tabs/All";
import Trending from "./tabs/Trending";
import ArticleDetail from "./ArticleDetail";
import { useGetModerationQueueQuery, useLazyGetArticleDetailQuery, useRecordArticleReadMutation, useLazyGetRelatedArticlesQuery } from "../../redux/Api/adminModerationApi";
import { useDigestFilter } from "./Digestfiltercontext";

const PAGE_SIZE = 10;

const mapArticleItem = (item) => {
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
};

const MemberDashboard = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const { activeFilters } = useDigestFilter();

  const [triggerGetArticleDetail] = useLazyGetArticleDetailQuery();
  const [recordArticleRead] = useRecordArticleReadMutation();
  const [triggerGetRelatedArticles] = useLazyGetRelatedArticlesQuery();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const apiFilters = useMemo(() => {
    const filters = { status: "live", page_size: PAGE_SIZE };
    if (tab === "all") {
      filters.page = page;
    }
    if (tab === "trending") {
      filters.ordering = "-read_count";
    }
    if (debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim();
    }
    if (activeFilters.length === 1) {
      filters.category = activeFilters[0].toLowerCase();
    }
    return filters;
  }, [tab, debouncedSearch, activeFilters, page]);

  const { data: moderationqueue, isLoading, isFetching } =
    useGetModerationQueueQuery(apiFilters);

  const totalCount = moderationqueue?.data?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const articles = useMemo(() => {
    const raw = moderationqueue?.data?.results || [];
    return raw.map(mapArticleItem);
  }, [moderationqueue]);

  const handleArticleClick = async (article) => {
    if (!article || !article.id) return;

    setDetailLoading(true);

    try {
      // Step 1: Load the article details
      const detailResult = await triggerGetArticleDetail(article.id).unwrap();
      const mappedDetail = mapArticleItem(detailResult?.data || detailResult);

      // Step 2: Display the article details immediately
      setDetail(mappedDetail);
      setDetailLoading(false);

      // Step 3: Record the article as read (fire-and-forget after detail is shown)
      recordArticleRead(article.id);

      // Step 4: Load related articles
      try {
        const relatedResult = await triggerGetRelatedArticles(article.id).unwrap();
        const relatedData = relatedResult?.data?.related_articles || relatedResult?.data?.results || relatedResult?.results || relatedResult?.data || [];
        const mappedRelated = Array.isArray(relatedData)
          ? relatedData.slice(0, 3).map(mapArticleItem)
          : [];
        setRelatedArticles(mappedRelated);
      } catch {
        // If related articles fail, just show empty
        setRelatedArticles([]);
      }
    } catch {
      // Fallback: if API call fails, use the article data we already have from the list
      setDetail(article);
      setDetailLoading(false);
      setRelatedArticles([]);

      // Still attempt record-read (fire-and-forget)
      recordArticleRead(article.id);
    }
  };

  const handleBack = (article) => {
    if (article && article.id) {
      handleArticleClick(article);
    } else {
      setDetail(null);
      setRelatedArticles([]);
    }
  };

  const handleTabChange = (value) => {
    setTab(value);
    setPage(1);
  };

  const trendingCount = articles.filter((a) => a.status === "live").length;

  return (
    <>
      {!detail && <TodaysSnapshot />}

      <div className="p-4 md:p-6">
        {detail ? (
          <ArticleDetail
            article={detail}
            onBack={handleBack}
            relatedArticles={relatedArticles}
            isLoading={detailLoading}
          />
        ) : (
          <Tabs value={tab} onValueChange={handleTabChange} defaultValue="all">
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
                    {totalCount}
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
              <All
                search={search}
                onArticleClick={handleArticleClick}
                articles={articles}
                isLoading={isLoading || isFetching}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </TabsContent>

            <TabsContent value="trending">
              <Trending search={search} onArticleClick={handleArticleClick} articles={articles} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default MemberDashboard;