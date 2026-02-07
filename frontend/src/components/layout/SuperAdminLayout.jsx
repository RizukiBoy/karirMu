import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logoz2.svg"
// ICONSAX
import { Notification, Logout, ProfileCircle } from "iconsax-reactjs";

// COMPONENTS
import SidebarSuperAdmin from "../sidebar/SidebarSuperAdmin";

export default function SuperAdminLayout({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      navigate("/super-admin/login");
    }
  }, [navigate]);

  const admin =
    JSON.parse(localStorage.getItem("adminData")) || {};

  const logout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminData");
    navigate("/super-admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-200">
        {/* TOPBAR */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {/* LEFT */}
          <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="KarirMU Logo"
            className="h-10 max-w-180px object-contain cursor-pointer"
            onClick={() => navigate("/super-admin/dashboard")}
          />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <Notification
              size="20"
              variant="Outline"
              className="text-gray-700 cursor-pointer"
            />

            <span className="text-sm text-gray-600">
              Halo, Admin Super
            </span>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="flex items-center gap-2"
            >
              <ProfileCircle
                size="28"
                variant="Bold"
                className="text-gray-700"
              />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex">
          <SidebarSuperAdmin open={open} setOpen={setOpen} />

          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto ml-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
