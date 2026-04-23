import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute — wraps a route that requires authentication.
 *   <PrivateRoute role="donor">  →  only "donor" users
 *   <PrivateRoute>               →  any logged-in user
 */
function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

export default PrivateRoute;
