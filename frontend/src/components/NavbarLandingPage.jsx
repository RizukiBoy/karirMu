import { NavLink } from "react-router-dom";
import logoKarirMu from "../assets/img/logoz2.svg";
const NavbarLandingPage = () => {
  return (
    <nav
      className="text-white"
      style={{
        background: "bg-white",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">

          {/* LOGO */}
          <div className="flex items-center">
            <img
              src={logoKarirMu}
              alt="KarirMU"
              className="h-13 w-auto"
            />
          </div>

          {/* ACTION BUTTONS */}
<div className="flex items-center gap-4">

  {/* MASUK - OUTLINE */}
  <NavLink to="/auth/login">
    <div className="p-2px rounded-xl">
      <div className="bg-white rounded-xl px-6 py-3 border-2 border-[#1D5F82] transition hover:bg-[#1D5F82] group">
        <span className="text-[#1D5F82] font-semibold group-hover:text-white text-base">
          Masuk
        </span>
      </div>
    </div>
  </NavLink>

  {/* DAFTAR - GRADIENT */}
  <NavLink to="/auth/register">
    <div
      className="rounded-xl px-6 py-3 transition opacity-95 hover:opacity-100"
      style={{
        background: "linear-gradient(to right, #1D5F82 0%, #409144 100%)",
      }}
    >
      <span className="text-white font-semibold text-base">
        Daftar
      </span>
    </div>
  </NavLink>

</div>

        </div>
      </div>
    </nav>
  );
};

export default NavbarLandingPage;