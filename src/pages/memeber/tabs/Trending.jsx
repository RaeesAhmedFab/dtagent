import { ARTICLES } from "../../../mockdata/Digestdata"; 
import { ArticleCard, DigestSidebar } from "../../../components/Digestcomponents";

const Trending = ({ search, onArticleClick }) => {
  const trending = ARTICLES.filter(a =>
    a.trending &&
    (!search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.source.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trending.map(a => (
            <ArticleCard key={a.id} article={a} onClick={onArticleClick} />
          ))}
        </div>
      </div>
      <DigestSidebar />
    </div>
  );
};

export default Trending;