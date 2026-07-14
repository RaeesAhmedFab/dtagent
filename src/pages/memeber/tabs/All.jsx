import { FeaturedCard, ArticleCard, DigestSidebar } from "../../../components/Digestcomponents";
import { FilterChips } from "../Categoryfilter"; 
import { useDigestFilter } from "../Digestfiltercontext";
import Loader from "../../../components/Loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const All = ({ onArticleClick, articles = [], isLoading, page = 1, totalPages = 1, onPageChange }) => {
  const { activeFilters, setActiveFilters } = useDigestFilter();

  const removeFilter = (key) =>
    setActiveFilters((prev) => prev.filter((f) => f !== key));

  const [featured, ...rest] = articles;

  if (isLoading) {
    return <Loader fullScreen={false} size={40} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">

        {/* Filter chips */}
        <FilterChips
          filters={activeFilters}
          onRemove={removeFilter}
          onClear={() => setActiveFilters([])}
        />

        {articles.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-[13px]">
            No articles match the selected filters.
          </div>
        ) : (
          <>
            {featured && (
              <FeaturedCard article={featured} onClick={onArticleClick} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} onClick={onArticleClick} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  className="cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(p)}
                    className={`min-w-[32px] cursor-pointer ${
                      p === page ? "bg-[#0f2d5c] text-white" : ""
                    }`}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="cursor-pointer"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <DigestSidebar />
    </div>
  );
};

export default All;