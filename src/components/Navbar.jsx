import { Link } from "react-router-dom";
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import {
  FaHeart,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaSearch,
} from "react-icons/fa"; // Icons from react-icons

const Navbar = () => {
  const { user, signOut } = useSupabaseAuth();

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-[1280px] w-[90%]">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold">
          Wikipedia Reader
        </Link>

        <div className="space-x-6 flex items-center">
          {user ? (
            <>
              {/* Favorites */}
              <Link
                to="/search"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaSearch className="mr-1" />
                Search
              </Link>
              {/* Favorites */}
              <Link
                to="/favorites"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaHeart className="mr-1" />
                Favorites
              </Link>

              {/* Groups */}
              <Link
                to="/related-groups"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaUsers className="mr-1" />
                Groups
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaUserCircle className="mr-1" />
                Profile
              </Link>

              {/* Log Out Button */}
              <button
                onClick={signOut}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSignInAlt className="mr-2" />
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
