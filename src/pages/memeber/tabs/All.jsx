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
                {(() => {
                  const getPageNumbers = () => {
                    const pages = new Set();
                    const siblingCount = 1;
                    const boundaryCount = 3;

                    // Always show first boundaryCount pages
                    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
                      pages.add(i);
                    }

                    // Show pages around current page
                    for (let i = Math.max(boundaryCount + 1, page - siblingCount); i <= Math.min(totalPages - boundaryCount, page + siblingCount); i++) {
                      pages.add(i);
                    }

                    // Always show last boundaryCount pages
                    for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
                      pages.add(i);
                    }

                    // Sort pages
                    const sorted = [...pages].sort((a, b) => a - b);

                    // Insert ellipsis markers
                    const result = [];
                    for (let i = 0; i < sorted.length; i++) {
                      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                        result.push("ellipsis");
                      }
                      result.push(sorted[i]);
                    }

                    return result;
                  };

                  return getPageNumbers().map((p, idx) => {
                    if (p === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-1 text-gray-400 text-sm select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
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
                    );
                  });
                })()}
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