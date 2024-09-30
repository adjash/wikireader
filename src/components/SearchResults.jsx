import { FaHeart } from "react-icons/fa"; // Import the heart icon from react-icons

const SearchResults = ({
  articles,
  loading,
  onLoadMore,
  hasMore,
  handleFavorite,
}) => {
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!articles.length) {
    return <p className="text-center text-gray-500">No articles found.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden relative"
          >
            {/* Image */}
            {article.thumbnailUrl ? (
              <img
                src={article.thumbnailUrl}
                alt={`Image of ${article.title}`}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {article.snippet
                  ? article.snippet.substring(0, 100)
                  : "No description available"}
                ...
              </p>
              <a
                href={`/article/${encodeURIComponent(article.title)}`} // Navigate to the new page
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Article
              </a>

              {/* Favorite Button */}
              <button
                onClick={() => handleFavorite(article)} // Call the handleFavorite function
                className={`float-right rounded-full ${
                  article.isFavorited ? "text-red-500" : "text-gray-400"
                } hover:text-red-500 transition-colors`}
              >
                <FaHeart />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
