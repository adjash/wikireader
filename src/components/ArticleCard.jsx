import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaHeart } from "react-icons/fa";

const ArticleCard = ({ article }) => {
  const [isFavorited, setIsFavorited] = useState(article.is_favorited);

  const handleFavorite = async () => {
    const { data, error } = await supabase
      .from("articles")
      .update({ is_favorited: !isFavorited })
      .eq("id", article.id);

    if (!error) {
      setIsFavorited(!isFavorited);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {article.article_title}
      </h3>
      <p className="text-gray-600 mb-4">
        {article.article_title.substring(0, 100)}...{" "}
        {/* Limit the title to 100 characters */}
      </p>
      <a
        href={`/article/${encodeURIComponent(article.article_title)}`} // Navigate to the new page
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Article
      </a>

      {/* Optional: Heart icon to indicate it's a favorite */}
      <div className="float-right text-red-500" onClick={handleFavorite}>
        <FaHeart />
      </div>
    </div>
  );
};

export default ArticleCard;
