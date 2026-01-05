import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SidebarAdminAum from "../sidebar/SidebarAdminAum"
import notificationIcon from "../../assets/icons/notification.svg";
import profileCircleIcon from "../../assets/icons/profile-circle.svg";

const AdminAumLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-200">
        {/* TOPBAR */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg">KarirMU</h1>
          </div>

          <div className="flex items-center gap-4">
            <img src={notificationIcon} className="w-5 h-5 cursor-pointer" />
            <span className="text-sm text-gray-600">Halo, Admin AUM</span>

            <button
              onClick={() => navigate("/auth/login")}
              className="flex items-center gap-2"
            >
              <img src={profileCircleIcon} className="w-8 h-8" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex">
          <SidebarAdminAum open={open} />
          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminAumLayout;
