import { useState, useEffect} from "react";
import axios from "axios";
import AdminSuperLayout from "../../components/layout/SuperAdminLayout";

// ICONSAX
import {
  Profile2User,
  UserTick,
  DocumentText,
  Warning2,
} from "iconsax-reactjs";

const DashboardAdminSuper = () => {
  const [summary, setSummary] = useState({
    pending_approval: 0,
    active_aum: 0,
    total_jobs: 0,
    total_applicants: 0,
  })

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);


useEffect(() => {
  const fetchDashboardSummary = async () => {
    try {
      setLoadingSummary(true);

      const res = await axios.get(
        "http://localhost:5000/api/admin/dashboard/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setSummary(res.data.data);
      console.log(res.data.data)
    } catch (error) {
      console.error("Gagal fetch dashboard summary:", error);
      setErrorSummary("Gagal memuat data dashboard");
    } finally {
      setLoadingSummary(false);
    }
  };

  fetchDashboardSummary();
}, []);


  return (
    <AdminSuperLayout>
      <div className="space-y-6">
        {/* ===============================
            INDIKATOR UTAMA
        =============================== */}
        <div
          className="px-4 py-3 rounded-t-lg font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Indikator Utama
        </div>

        {/* CARD INDIKATOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-b-xl shadow space-y-3">
            <div className="w-10 h-10 bg-[#409144] rounded-full flex items-center justify-center">
              <Profile2User size="20" color="#fff" variant="Bold" />
            </div>
            <p className="text-2xl font-bold">
              {loadingSummary ? "-" : summary.pending_approval}
            </p>
            <p className="text-sm text-gray-600">
              Menunggu Persetujuan
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-b-xl shadow space-y-3">
            <div className="w-10 h-10 bg-[#409144] rounded-full flex items-center justify-center">
              <UserTick size="20" color="#fff" variant="Bold" />
            </div>
            <p className="text-2xl font-bold">
              {loadingSummary ? "-" : summary.active_aum}
            </p>
            <p className="text-sm text-gray-600">
              Total AUM Aktif
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-b-xl shadow space-y-3">
            <div className="w-10 h-10 bg-[#409144] rounded-full flex items-center justify-center">
              <DocumentText size="20" color="#fff" variant="Bold" />
            </div>
            <p className="text-2xl font-bold">
              {loadingSummary ? "-" : summary.total_jobs}
            </p>
            <p className="text-sm text-gray-600">
              Total Lowongan
            </p>
          </div>

          {/* CARD 4 */}
          <div className="bg-white p-6 rounded-b-xl shadow space-y-3">
            <div className="w-10 h-10 bg-[#409144] rounded-full flex items-center justify-center">
              <Profile2User size="20" color="#fff" variant="Bold" />
            </div>
            <p className="text-2xl font-bold">
              {loadingSummary ? "-" : summary.total_applicants}
            </p>
            <p className="text-sm text-gray-600">
              Total Pelamar
            </p>
          </div>
        </div>

        {/* ===============================
            PEMBERITAHUAN TERBARU
        =============================== */}
        <div
          className="px-4 py-3 rounded-t-lg font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Pemberitahuan Terbaru
        </div>

        {/* CARD DENGAN GARIS TITIK-TITIK */}
        <div className="border-2 border-dashed border-[#409144] bg-green-50 rounded-b-xl p-6 space-y-4">
          {[
            "3 Instansi AUM baru sedang menunggu validasi AUM.",
            "10 Lowongan baru telah diterbitkan oleh Admin AUM yang berizin.",
            "50 Pelamar baru mendaftar di sistem hari ini.",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <Warning2
                size="20"
                color="#409144"
                variant="Bold"
                className="mt-0.5"
              />
              <p className="text-sm text-gray-700">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </AdminSuperLayout>
  );
};

export default DashboardAdminSuper;
