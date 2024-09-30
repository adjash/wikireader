import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSupabaseAuth();

  // Wait until session loading is complete
  if (loading) {
    return <p>Loading...</p>; // You can add a loading spinner or animation here
  }

  // If no user is detected after loading is complete, redirect to login
  if (!user) {
    console.log("No user detected, redirecting to login...");
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the children (protected content)
  return children;
};

export default ProtectedRoute;
