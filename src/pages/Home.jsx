import { useState } from "react";
import { fetchArticles, handleFavorite } from "../lib/wikiApi"; // Import the handleFavorite function
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import SearchInput from "../components/SearchInput";
import SearchResults from "../components/SearchResults";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ARTICLES_PER_PAGE = 9;
  const { user } = useSupabaseAuth(); // Get the current user

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
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold">Unlock the World of Knowledge</h1>
          <p className="mt-6 text-lg">
            Search, save, and organize Wikipedia articles for an enhanced
            reading experience.
          </p>
          <button className="mt-8 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Marketing Section */}
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-gray-100 rounded-lg shadow-md">
            <h3 className="mt-4 text-lg font-semibold">Discover</h3>
            <p className="mt-2 text-gray-600">
              Browse articles and discover new insights on any topic.
            </p>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg shadow-md">
            <h3 className="mt-4 text-lg font-semibold">Organize</h3>
            <p className="mt-2 text-gray-600">
              Group articles and save them for future reading sessions.
            </p>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg shadow-md">
            <h3 className="mt-4 text-lg font-semibold">Progress</h3>
            <p className="mt-2 text-gray-600">
              Track your reading progress and never lose your place.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Results Section */}
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
    </div>
  );
};

export default Home;
