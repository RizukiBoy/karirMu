import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ICONSAX
import {
  Home2,
  DocumentCopy,
  Profile2User,
  Menu,
  CloseCircle,
  AddCircle,
} from "iconsax-reactjs";

const SidebarSuperAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
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
  const SidebarItem = ({ icon: Icon, text, active, onClick }) => (
    <li
      onClick={() => {
        onClick();
        if (isMobile) setOpen(false);
      }}
      className={`flex items-center gap-3 h-12 px-3 cursor-pointer border-l-4 transition-all
        ${
          active
            ? "bg-gray-200 border-gray-800 font-semibold"
            : "border-transparent hover:bg-gray-50"
        }
      `}
    >
      <Icon
        size="20"
        variant={active ? "Bold" : "Outline"}
        className={active ? "text-gray-900" : "text-gray-600"}
      />
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
            {open ? (
              <CloseCircle size="16" variant="Bold" />
            ) : (
              <Menu size="22" variant="Bold" />
            )}
          </button>
        </div>

        {/* ===== MENU ===== */}
        <ul className="pt-2">
          <SidebarItem
            icon={Home2}
            text="Dashboard"
            active={isActive("/super-admin/dashboard")}
            onClick={() => navigate("/super-admin/dashboard")}
          />

          <SidebarItem
            icon={DocumentCopy}
            text="Pengajuan AUM"
            active={isActive("/super-admin/pengajuan-aum")}
            onClick={() => navigate("/super-admin/pengajuan-aum")}
          />

          <SidebarItem
            icon={AddCircle}
            text="Kelola Bidang"
            active={isActive("/super-admin/job-field")}
            onClick={() => navigate("/super-admin/job-field")}
          />
        </ul>
      </aside>
    </>
  );
};

export default SidebarSuperAdmin;
