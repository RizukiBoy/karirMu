import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
   <div className="navbar bg-linear-to-r from-[#1D5F82] to-[#409144]">
      <div className="container mx-auto px-2">
        <div className="navbar-box flex items-center justify-between py-6 text-white">
          
          {/* LOGO */}
          <div className="logo">
            <h1 className="text-3xl font-bold">KarirMU</h1>
          </div>

          {/* MENU */}
          <div className="menu flex gap-10 font-medium">
            <NavLink to="/" className="hover:underline">
              Beranda
            </NavLink>
            <NavLink to="tentang-karirmu" className="hover:underline">
              Tentang
            </NavLink>
            <NavLink to="kontak-karirmu" className="hover:underline">
              Kontak
            </NavLink>
            <NavLink to="/auth/login" className="hover:underline">
              login
            </NavLink>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
