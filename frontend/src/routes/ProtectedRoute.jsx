import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // 🔴 Belum login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 🔴 Role tidak sesuai
  if (!allowedRole.includes(role)) {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ Lolos
  return <Outlet />;
};

export default ProtectedRoute;
