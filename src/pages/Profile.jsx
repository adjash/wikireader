import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaHeart } from "react-icons/fa";

const Profile = () => {
  const { user, signOut } = useSupabaseAuth();
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return; // Ensure user is loaded before querying

      try {
        // Fetch favorites (adjust query if needed)
        const { data: favData, error: favError } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id); // Remove 'is_favorited' condition

        if (favError) throw favError;

        // Fetch progress
        const { data: progressData, error: progressError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id);

        if (progressError) throw progressError;

        // Set data in state
        setFavorites(favData);
        setProgress(progressData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) return <p className="text-center">Loading user...</p>;

  if (loading) return <p className="text-center">Loading data...</p>;

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            {user.email}
          </h1>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Favorited Articles
          </h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500">No favorites yet.</p>
          ) : (
            <ul className="space-y-4">
              {favorites.map((article) => (
                <li
                  key={article.id}
                  className="border border-gray-300 p-4 rounded-md"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {article.article_title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {article.article_title.substring(0, 100)}...{" "}
                      {/* Limit the title to 100 characters */}
                    </p>
                    <a
                      href={`/article/${encodeURIComponent(
                        article.article_title
                      )}`} // Navigate to the new page
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Article
                    </a>

                    {/* Optional: Heart icon to indicate it's a favorite */}
                    <div className="float-right text-red-500">
                      <FaHeart />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Reading Progress
          </h2>
          {progress.length === 0 ? (
            <p className="text-gray-500">No reading progress yet.</p>
          ) : (
            <ul className="space-y-4">
              {progress.map((item) => (
                <li
                  key={item.article_id}
                  className="border border-gray-300 p-4 rounded-md"
                >
                  <p>
                    Article {item.article_id}: {item.progress}% completed
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
