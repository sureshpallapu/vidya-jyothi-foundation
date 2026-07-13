import { Navigate, useLocation } from "react-router-dom";

import { isAuthenticated } from "../../utils/adminAuth";

function ProtectedRoute({ children }) {

  const location = useLocation();

  /*
  |--------------------------------------------------------------------------
  | Check Session
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated()) {

    return (

      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />

    );

  }

  return children;

}

export default ProtectedRoute;