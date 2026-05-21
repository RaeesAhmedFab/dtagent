import { ARTICLES } from "../../../mockdata/Digestdata"; 
import { FeaturedCard, ArticleCard, DigestSidebar } from "../../../components/Digestcomponents";

const All = ({ search, onArticleClick }) => {
  const filtered = ARTICLES.filter(a =>
    !search ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.source.toLowerCase().includes(search.toLowerCase())
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        {featured && (
          <FeaturedCard article={featured} onClick={onArticleClick} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map(a => (
            <ArticleCard key={a.id} article={a} onClick={onArticleClick} />
          ))}
        </div>
      </div>
      <DigestSidebar />
    </div>
  );
};

export default All;