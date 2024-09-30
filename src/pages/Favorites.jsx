import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaHeart } from "react-icons/fa"; // Optional: Add a heart icon for consistency with other pages
import ArticleCard from "../components/ArticleCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null); // Store the user session

  useEffect(() => {
    // Fetch the current user session
    const getUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        console.error("No user logged in");
      }
    };

    getUserSession();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        const { data, error } = await supabase
          .from("favorites") // Fetch from the correct table
          .select("*")
          .eq("user_id", user.id); // Filter by the logged-in user

        if (error) {
          console.error("Error fetching favorites:", error);
        } else {
          setFavorites(data);
        }
      };

      fetchFavorites();
    }
  }, [user]); // Run the effect when the user is set

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">
          Your Favorite Articles
        </h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">
            You have no favorite articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((article) => (
              <div
                key={article.article_id}
                className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden relative"
              >
                {/* Image */}
                {article.article_thumbnail ? (
                  <img
                    src={article.article_thumbnail}
                    alt={`Image of ${article.article_title}`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}

                {/* Content */}
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
