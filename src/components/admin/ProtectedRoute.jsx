import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("adminLoggedIn");

  if (!loggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;