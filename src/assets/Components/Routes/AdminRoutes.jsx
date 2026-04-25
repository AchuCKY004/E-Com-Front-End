import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";


function AdminRoutes({ children }) {
  const { role, isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}


export default AdminRoutes;