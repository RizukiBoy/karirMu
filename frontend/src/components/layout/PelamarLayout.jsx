import { useState } from "react";
import { useNavigate } from "react-router-dom";

// SIDEBAR PELAMAR
import SidebarPelamar from "../sidebar/SidebarPelamar";

// ICONS & LOGO
import notificationIcon from "../../assets/icons/notification.svg";
import profileCircleIcon from "../../assets/icons/profile-circle.svg";
import logoKarirMu from "../../assets/img/logoz2.svg";

const PelamarLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-200">
        {/* ================= TOPBAR ================= */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img
              src={logoKarirMu}
              alt="KarirMU Logo"
              className="h-10 max-w-180px object-contain cursor-pointer"
              onClick={() => navigate("/user/dashboard")}
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <img
              src={notificationIcon}
              className="w-5 h-5 cursor-pointer"
              alt="Notification"
            />

            <span className="text-sm text-gray-600">
              Halo, Pelamar
            </span>

            <button
              onClick={() => navigate("/auth/login")}
              className="flex items-center gap-2"
            >
              <img
                src={profileCircleIcon}
                className="w-8 h-8"
                alt="Profile"
              />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex">
          {/* SIDEBAR */}
          <SidebarPelamar open={open} />

          {/* CONTENT */}
          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto ml-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PelamarLayout;