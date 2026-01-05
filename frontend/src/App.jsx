import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Home from "./public/Home";

// Auth
import Login from "./auth/Login";
import Register from "./auth/Register";
import CheckEmail from "./auth/CheckEmail";
import ActivateAccount from "./auth/ActivateAccount";
import SetPassword from "./auth/SetPassword";

// AdminAUM
import DashboardAdminAum from "./pages/adminAum/DashboardAdminAum";
import ProfilAum from "./pages/adminAum/ProfilAum";
import DetailProfilAum from "./pages/adminAum/DetailProfilAum";
import Lowongan from "./pages/adminAum/lowongan";
import DataAum from "./components/adminAum/DataAum";
import DokumenAum from "./components/adminAum/DokumenAum";

// public page
import JobList from "./public/jobList";
// Pelamar
import DashboardPelamar from "./pages/pelamar/DashboardPelamar";

function App() {
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname.startsWith("/admin-aum") ||
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/pelamar");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/check-email" element={<CheckEmail />} />
        <Route path="/auth/activate" element={<ActivateAccount />} />
        <Route path="/auth/set-password" element={<SetPassword />} />

        {/* ADMIN AUM (PROTECTED) */}
        <Route element={<ProtectedRoute allowedRole={["company_hrd"]} />}>
          <Route path="/admin-aum/dashboard" element={<DashboardAdminAum />} />
          <Route path="/admin-aum/profil" element={<ProfilAum />} />
          <Route path="/admin-aum/detail" element={<DetailProfilAum />} />
          <Route path="/admin-aum/data" element={<DataAum />} />
          <Route path="/admin-aum/lowongan" element={<Lowongan />} />
          <Route path="/admin-aum/dokumen" element={<DokumenAum/>} />
        </Route>

        {/* PUBLIC */}
        <Route path="/public/jobs" element={<JobList />} />

        {/* PELAMAR */}
        <Route path="/pelamar/dashboard" element={<DashboardPelamar />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
