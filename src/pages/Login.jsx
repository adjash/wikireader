import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (!error) {
      navigate("/");
    } else {
      console.error("Error logging in:", error.message);
    }
  };

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (!error) {
      navigate("/");
    } else {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Log In to Your Account
        </h1>
        <p className="text-gray-500 text-center">
          Access your personalized Wikipedia reading experience
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Log In with Google
          </button>
          <button
            onClick={handleGitHubLogin}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            Log In with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
