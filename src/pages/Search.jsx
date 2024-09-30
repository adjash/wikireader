import SearchInput from "../components/SearchInput";
import SearchResults from "../components/SearchResults";
import { useState } from "react";
import { fetchArticles, handleFavorite } from "../lib/wikiApi"; // Import the handleFavorite function
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
function SearchPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { user } = useSupabaseAuth(); // Get the current user
  const ARTICLES_PER_PAGE = 9;

  const handleSearch = (searchTerm) => {
    setPage(1);
    fetchArticles(
      searchTerm,
      1,
      ARTICLES_PER_PAGE,
      setLoading,
      setArticles,
      setHasMore
    );
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(
      articles[0].title,
      nextPage,
      ARTICLES_PER_PAGE,
      setLoading,
      setArticles,
      setHasMore
    );
  };
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto">
        <SearchInput onSearch={handleSearch} />
        <SearchResults
          articles={articles}
          loading={loading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          handleFavorite={(article) =>
            handleFavorite(article, user, setArticles)
          } // Pass handleFavorite to SearchResults
        />
      </div>
    </section>
  );
}
export default SearchPage;
