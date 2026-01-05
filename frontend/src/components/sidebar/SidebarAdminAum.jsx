import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ICONS
import homeIcon from "../../assets/icons/home.svg";
import profileIcon from "../../assets/icons/document-text.svg";
import tagsIcon from "../../assets/icons/tags.svg";
import usersIcon from "../../assets/icons/users.svg";
import settingIcon from "../../assets/icons/setting-2.svg";
import vectorIcon from "../../assets/icons/vector.svg";
import menuIcon from "../../assets/icons/menu.svg";
import closeIcon from "../../assets/icons/iconClose.svg";

const SidebarAdminAum = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ===== RESPONSIVE HANDLER ===== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setOpen(false);
      } else {
        setIsMobile(false);
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);

  /* ===== SIDEBAR ITEM ===== */
  const SidebarItem = ({ icon, text, active, onClick }) => (
    <li
      onClick={() => {
        onClick();
        if (isMobile) setOpen(false);
      }}
      className={`flex items-center gap-3 h-12 px-3 cursor-pointer border-l-4 transition-all
        ${
          active
            ? "bg-gray-100 border-gray-800 font-semibold"
            : "border-transparent hover:bg-gray-50"
        }
      `}
    >
      <img src={icon} className="w-5 h-5" alt={text} />
      {open && <span className="text-sm">{text}</span>}
    </li>
  );

  return (
    <>
      {/* ===== OVERLAY MOBILE ===== */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed lg:static z-50
          ${open ? "w-64" : "w-16"}
          h-[calc(100vh-64px)]
          bg-white
          transition-all duration-300 ease-in-out
          overflow-y-auto
        `}
      >
        {/* ===== HEADER ===== */}
        <div
          className={`flex items-center h-14 px-3 ${
            open ? "justify-end" : "justify-center"
          }`}
        >
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center rounded transition hover:bg-gray-100 p-2"
          >
            <img
              src={open ? closeIcon : menuIcon}
              className={`transition-all duration-300 ${
                open ? "w-3 h-3" : "w-5 h-5"
              }`}
              alt="toggle"
            />
          </button>
        </div>

        {/* ===== MENU ===== */}
        <ul className="pt-2">
          <SidebarItem
            icon={homeIcon}
            text="Dashboard"
            active={isActive("/admin-aum/dashboard")}
            onClick={() => navigate("/admin-aum/dashboard")}
          />

          <SidebarItem
            icon={profileIcon}
            text="Profil & Legalitas AUM"
            active={isActive("/admin-aum/profil")}
            onClick={() => navigate("/admin-aum/profil")}
          />

          <SidebarItem
            icon={tagsIcon}
            text="Manajemen Lowongan"
            active={isActive("/admin-aum/lowongan")}
            onClick={() => navigate("/admin-aum/lowongan")}
          />

          <SidebarItem
            icon={usersIcon}
            text="Manajemen Pelamar"
            active={isActive("/admin-aum/pelamar")}
            onClick={() => navigate("/admin-aum/pelamar")}
          />

          {/* ===== PENGATURAN ===== */}
          <li
            onClick={() => setOpenSetting(!openSetting)}
            className="flex items-center justify-between px-4 h-12 cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <img src={settingIcon} className="w-5 h-5" />
              {open && <span className="text-sm">Pengaturan</span>}
            </div>

            {open && (
              <img
                src={vectorIcon}
                className={`w-4 h-4 transition-transform duration-300 ${
                  openSetting ? "rotate-180" : ""
                }`}
              />
            )}
          </li>

          {/* ===== SUB MENU ===== */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open && openSetting ? "max-h-40" : "max-h-0"
            }`}
          >
            <ul className="ml-10 mt-2 space-y-2">
              <li
                onClick={() => navigate("/admin-aum/akun")}
                className="text-sm cursor-pointer hover:text-blue-600"
              >
                Akun
              </li>
              <li
                onClick={() => navigate("/admin-aum/keamanan")}
                className="text-sm cursor-pointer hover:text-blue-600"
              >
                Keamanan
              </li>
              <li
                onClick={() => navigate("/admin-aum/notifikasi")}
                className="text-sm cursor-pointer hover:text-blue-600"
              >
                Notifikasi
              </li>
            </ul>
          </div>
        </ul>
      </aside>
    </>
  );
};

export default SidebarAdminAum;
