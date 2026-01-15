import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      navigate("/superadmin/login");
    }
  }, [navigate]);

  const admin =
    JSON.parse(localStorage.getItem("adminData")) || {};

  const logout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminData");
    navigate("/superadmin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-5 space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-emerald-600">
            Superadmin
          </h1>
          <p className="text-xs text-gray-500">
            Dashboard Control
          </p>
        </div>

        <nav className="space-y-2 text-sm">
          <button
            onClick={() => navigate("/superadmin/dashboard")}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/superadmin/admin/add")}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            Tambah Admin
          </button>
        </nav>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            Login sebagai
          </p>
          <p className="text-sm font-medium">
            {admin.name || "Admin"}
          </p>

          <button
            onClick={logout}
            className="mt-3 text-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
