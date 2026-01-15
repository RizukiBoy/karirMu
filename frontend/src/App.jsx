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
import JobList from "./public/JobList";
// Pelamar
import DashboardPelamar from "./pages/pelamar/DashboardPelamar";
import ListLowongan from "./pages/adminAum/ListLowongan";
import Profile from "./pages/pelamar/Profile";

import JobFields from "./pages/superadmin/JobField";
import JobDetailPage from "./components/JobDetailPage";
import AddProfile from "./components/users/Addprofile";
import ApplicationList from "./pages/adminAum/ApplicationList";
import ApplicationDetail from "./components/ApplicationDetail";
import LoginAdmin from "./pages/superadmin/loginAdmin";
import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin";
import AdminAumDetail from "./pages/superadmin/AdminAumDetail";
import RegisterAum from "./auth/RegisterAum";

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
        <Route path="/auth/register-admin-aum" element={<RegisterAum />} />
        

        <Route element={<ProtectedRoute allowedRole={["pelamar"]} />}>
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/add-profile" element={<AddProfile />} />
        <Route path="/user/dashboard" element={<DashboardPelamar />} />
        </Route>


        {/* ADMIN AUM (PROTECTED) */}
        <Route element={<ProtectedRoute allowedRole={["company_hrd"]} />}>
          <Route path="/admin-aum/dashboard" element={<DashboardAdminAum />} />
          <Route path="/admin-aum/profil" element={<ProfilAum />} />
          <Route path="/admin-aum/detail" element={<DetailProfilAum />} />
          <Route path="/admin-aum/data" element={<DataAum />} />
          <Route path="/admin-aum/lowongan" element={<Lowongan />} />
          <Route path="/admin-aum/list-lowongan" element={<ListLowongan />} />
          <Route path="/admin-aum/dokumen" element={<DokumenAum/>} />
          <Route path="/admin-aum/list-pelamar" element={<ApplicationList />} />
          <Route path="/job-field" element={<JobFields />} />
          <Route path="/admin-aum/list-pelamar/:applyId" element={<ApplicationDetail />} />


        </Route>

        {/* PUBLIC */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />

        {/* PELAMAR */}

        <Route path="/super-admin/login" element={<LoginAdmin />} />
        <Route path="/super-admin/dashboard" element={<DashboardSuperAdmin />} />
        <Route path="/super-admin/detail/:companyId" element={<AdminAumDetail />} />

      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
