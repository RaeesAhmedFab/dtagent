import { ARTICLES } from "../../../mockdata/Digestdata";
import { FeaturedCard, ArticleCard, DigestSidebar } from "../../../components/Digestcomponents";
import { FilterChips } from "../Categoryfilter"; 
import { useDigestFilter } from "../Digestfiltercontext";

const All = ({ search, onArticleClick }) => {
  const { activeFilters, setActiveFilters } = useDigestFilter();

  const filtered = ARTICLES.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.source.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      !activeFilters.length ||
      a.cats.some((cat) => activeFilters.includes(cat.toUpperCase()));

    return matchSearch && matchFilter;
  });

  const removeFilter = (key) =>
    setActiveFilters((prev) => prev.filter((f) => f !== key));

  const [featured, ...rest] = filtered;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">

        {/* Filter chips */}
        <FilterChips
          filters={activeFilters}
          onRemove={removeFilter}
          onClear={() => setActiveFilters([])}
        />

        {filtered.length === 0 ? (
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
          </>
        )}
      </div>

      <DigestSidebar />
    </div>
  );
};

export default All;