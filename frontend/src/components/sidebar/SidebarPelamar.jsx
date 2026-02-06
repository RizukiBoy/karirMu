import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ICONS
import homeIcon from "../../assets/icons/home.svg";
import profileIcon from "../../assets/icons/ProfilPelamar/profile.svg";
import cariLowonganIcon from "../../assets/icons/ProfilPelamar/cari-lowongan.svg";
import historyIcon from "../../assets/icons/ProfilPelamar/history.svg";
import saveIcon from "../../assets/icons/ProfilPelamar/save.svg";
import menuIcon from "../../assets/icons/menu.svg";
import closeIcon from "../../assets/icons/iconClose.svg";

const SidebarPelamar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* ===============================
     RESPONSIVE SIDEBAR
  =============================== */
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

  /* ===============================
     ACTIVE MENU HANDLER
  =============================== */
  const isActive = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  /* ===============================
     SIDEBAR ITEM COMPONENT
  =============================== */
  const SidebarItem = ({ icon, text, path }) => {
    const active = isActive(path);

    return (
      <li
        onClick={() => {
          navigate(path);
          if (isMobile) setOpen(false);
        }}
        className="px-1"
      >
        <div
          className={`group flex items-center gap-3 h-12 px-3 cursor-pointer rounded-lg transition-all duration-200
            ${active ? "font-semibold" : ""}
          `}
          style={{
            background: active
              ? "linear-gradient(90deg, #009B49 0%, #004F8F 100%)"
              : undefined,
          }}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.background =
                "linear-gradient(90deg, #009B49 0%, #004F8F 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <img
            src={icon}
            className={`w-5 h-5 transition-all
              ${
                active
                  ? "filter invert brightness-0"
                  : "group-hover:filter group-hover:invert group-hover:brightness-0"
              }
            `}
            alt={text}
          />

          {open && (
            <span
              className={`text-sm transition-all
                ${
                  active
                    ? "text-white"
                    : "text-gray-800 group-hover:text-white"
                }
              `}
            >
              {text}
            </span>
          )}
        </div>
      </li>
    );
  };

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-16 bottom-0 bg-black/40 z-40"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 ${
          open ? "w-64" : "w-16"
        } h-[calc(100vh-64px)] bg-white transition-all duration-300 overflow-y-auto`}
      >
        {/* TOGGLE */}
        <div
          className={`flex items-center h-14 px-3 ${
            open ? "justify-end" : "justify-center"
          }`}
        >
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg hover:bg-gray-100 p-2"
          >
            <img
              src={open ? closeIcon : menuIcon}
              className={`${open ? "w-3 h-3" : "w-5 h-5"}`}
              alt="toggle"
            />
          </button>
        </div>

        {/* MENU */}
        <ul className="pt-2 pl-1 space-y-1">
          <SidebarItem
            icon={homeIcon}
            text="Dashboard"
            path="/user/dashboard"
          />

          <SidebarItem
            icon={profileIcon}
            text="Profil & Berkas"
            path="/user/profile"
          />

          <SidebarItem
            icon={cariLowonganIcon}
            text="Cari Lowongan"
            path="/jobs"
          />

          <SidebarItem
            icon={historyIcon}
            text="Riwayat Lamaran"
            path="/user/history-jobs"
          />

          <SidebarItem
            icon={saveIcon}
            text="Lowongan Simpan"
            path="/user/saved-jobs"
          />
        </ul>
      </aside>
    </>
  );
};

export default SidebarPelamar;