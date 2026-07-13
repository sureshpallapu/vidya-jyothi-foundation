import { Navigate } from "react-router-dom";

function RoleProtectedRoute({

  allowedRoles,

  children,

}) {

  const admin =
    JSON.parse(
      localStorage.getItem("admin")
    ) || {};

  if (!allowedRoles.includes(admin.role)) {

    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );

  }

  return children;

}

export default RoleProtectedRoute;