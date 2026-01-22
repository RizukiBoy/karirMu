import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminAumLayout from "../../components/layout/AdminAumLayout";

// ICONS
import iconUser from "../../assets/icons/iconUser.svg";
import iconTrending from "../../assets/icons/ic-trending-up.svg";
import iconNotification from "../../assets/icons/iconNotification.svg";
import iconCeklist from "../../assets/icons/iconCeklist.svg";
import iconPeringatan from "../../assets/icons/iconPeringatan.svg";
import iconClose from "../../assets/icons/iconClose.svg";
import alertIcon from "../../assets/icons/alert.svg";

const DashboardAdminAum = () => {
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(true);
  const isProfilLengkap = false;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_applicants: 0,
    submitted: 0,
    accepted: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);

  // ===== TABLE STYLE =====
  const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    borderRight: "1px solid #E5E7EB",
    whiteSpace: "nowrap",
  };

  const thStyleCenter = { ...thStyle, textAlign: "center" };

  const tdStyle = {
    padding: "12px",
    borderTop: "1px solid #E5E7EB",
    whiteSpace: "nowrap",
  };

  const tdStyleCenter = { ...tdStyle, textAlign: "center" };

  // ===== FETCH DASHBOARD DATA =====
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        const [appsRes, jobsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin-aum/applications", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, limit: 5 },
          }),
          axios.get("http://localhost:5000/api/admin-aum/jobs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          total_jobs: jobsRes.data.jobs?.length || 0,
          total_applicants: jobsRes.data.total?.total_applicants || 0,
          submitted: jobsRes.data.total?.submitted || 0,
          accepted: jobsRes.data.total?.accepted || 0,
        });

        setJobs(jobsRes.data.jobs || []);
        console.log(jobsRes.data.jobs);
        setRecentApps(appsRes.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminAumLayout>
      <div className="w-full flex justify-center px-3 sm:px-4 md:px-6 py-6">
        <div className="flex flex-col gap-4 w-full max-w-1124px">

          {/* HEADER DASHBOARD */}
          <div className="bg-white font-semibold text-gray-800 text-sm sm:text-base px-4 py-3 rounded-xl shadow-sm border border-gray-100">
            Dashboard
          </div>

          {/* SELAMAT DATANG */}
          <div className="text-black font-bold text-xl bg-white px-4 py-6 rounded-b-xl shadow-sm border border-gray-100">
            SELAMAT DATANG ADMIN AUM!
          </div>

          {/* NOTIF PROFIL BELUM LENGKAP */}
          {!isProfilLengkap && showNotif && (
            <div className="relative bg-[#FFFBEB] border-l-4 border-yellow-400 rounded-lg p-6 shadow-sm flex flex-col gap-5 transition-all">
              <button 
                onClick={() => setShowNotif(false)}
                className="absolute top-4 right-4 p-1 hover:bg-yellow-100 rounded-full transition-colors"
              >
                <img src={iconClose} alt="close" className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <img src={alertIcon} alt="alert" className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-base">
                    Profil Anda Belum Lengkap
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Lengkapi profil untuk dapat menggunakan seluruh fitur rekrutmen kami.
                  </p>
                </div>
              </div>

              <div className="pl-10">
                <button 
                  onClick={() => navigate("/admin-aum/profil")}
                  className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-md font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Lengkapi Profil Anda Sekarang
                </button>
              </div>
            </div>
          )}

          {/* RINGKASAN AKTIVITAS */}
          <div
            className="text-white font-medium px-4 py-3 rounded-t-xl"
            style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}
          >
            Ringkasan Aktivitas
          </div>

          <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-b-xl border-x border-b border-gray-200 shadow-sm">
            {[
              ["Total Lowongan", stats.total_jobs],
              ["Total Pelamar", stats.total_applicants],
              ["Perlu Review", stats.submitted],
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{item[0]}</p>
                    <p className="text-2xl font-bold text-gray-800">{item[1]}</p>
                  </div>
                  <img src={iconUser} alt="icon" className="w-60px h-60px" />
                </div>

                <div className="flex items-center gap-2 text-xs text-green-500 mt-4 font-semibold">
                  <img src={iconTrending} alt="trend" className="w-4 h-4" />
                  8.5% Up from yesterday
                </div>
              </div>
            ))}
          </div>

          {/* DAFTAR MANAJEMEN PELAMAR */}
          <div
            className="text-white font-medium px-4 py-3 rounded-t-xl"
            style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}
          >
            Daftar Manajemen Pelamar
          </div>

          <div className="bg-white overflow-x-auto rounded-b-xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-800px text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th style={thStyle}>Judul Lowongan</th>
                  <th style={thStyle}>Lokasi</th>
                  <th style={thStyle}>Bidang</th>
                  <th style={thStyle}>Pelamar</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyleCenter}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Tidak ada lowongan
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td style={tdStyle}>{job.job_name}</td>
                      <td style={tdStyle}>{job.location}</td>
                      <td style={tdStyle}>{job.job_field_name}</td>
                      <td style={tdStyle}>{job.total_applicants} Orang</td>
                      <td style={tdStyle}>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          job.status === true || job.status === "true"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {job.status === true || job.status === "true" ? "Aktif" : "Tutup"}
                      </span>

                      </td>
                      <td style={tdStyleCenter}>
                        <button
                          onClick={() =>
                            navigate("/admin-aum/lihat-pelamar", {
                              state: { jobId: job._id, jobName: job.job_name },
                            })
                          }
                          className="
                            px-4 py-1.5
                            text-green-600
                            border border-green-600
                            bg-transparent
                            rounded-md
                            text-xs
                            font-medium
                            hover:bg-green-600
                            hover:text-white
                            transition-colors
                            duration-200
                          "
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* AKTIVITAS TERBARU */}
          <div
            className="text-white font-medium px-4 py-3 rounded-t-xl"
            style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}
          >
            Aktivitas Terbaru
          </div>

          <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {loading ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : recentApps.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500">
                      Belum ada aktivitas
                    </td>
                  </tr>
                ) : (
                  recentApps.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 w-12 text-center border-b border-gray-100">
                        <img
                          src={
                            app.apply_status === "accepted"
                              ? iconCeklist
                              : app.apply_status === "rejected"
                              ? iconPeringatan
                              : iconNotification
                          }
                          className="w-5 h-5 mx-auto"
                          alt="notif"
                        />
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <span className="font-bold text-gray-700">
                          {app.applicant?.full_name}
                        </span>{" "}
                        {app.apply_status === "accepted"
                          ? "diloloskan"
                          : app.apply_status === "rejected"
                          ? "ditolak"
                          : "melamar"}{" "}
                        posisi{" "}
                        <span className="text-blue-600 font-medium">
                          {app.job?.job_name}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminAumLayout>
  );
};

export default DashboardAdminAum;
