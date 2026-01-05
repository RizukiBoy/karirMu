import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAumLayout from "../../components/layout/AdminAumLayout";

// ICONS - Memanggil file original sesuai struktur folder Anda
import iconUser from "../../assets/icons/iconUser.svg";
import iconTrending from "../../assets/icons/ic-trending-up.svg";
import iconNotification from "../../assets/icons/iconNotification.svg";
import iconCeklist from "../../assets/icons/iconCeklist.svg";
import iconPeringatan from "../../assets/icons/iconPeringatan.svg"; // untuk tabel Staff Admin
import iconClose from "../../assets/icons/iconClose.svg";
import alertIcon from "../../assets/icons/alert.svg"; // untuk notifikasi Profil Belum Lengkap

const DashboardAdminAum = () => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(true);
  const isProfilLengkap = false;

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

  return (
    <AdminAumLayout>
      {/* WRAPPER UTAMA */}
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

          {/* NOTIF PROFIL BELUM LENGKAP (Card Kuning) */}
          {!isProfilLengkap && showNotif && (
            <div className="relative bg-[#FFFBEB] border-l-4 border-yellow-400 rounded-lg p-6 shadow-sm flex flex-col gap-5 transition-all">
              
              {/* Tombol Close X */}
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
    <div className="flex justify-between items-center w-full">
      <p className="font-bold text-gray-800 text-base">Profil Anda Belum Lengkap</p>
    </div>
    <p className="text-sm text-gray-600 mt-1">
      Lengkapi profil untuk dapat menggunakan seluruh fitur rekrutmen kami.
    </p>
  </div>
</div>


              {/* Tombol Lengkapi Profil */}
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
          <div className="text-black font-medium bg-[#A2A9B0] px-4 py-3 rounded-t-xl">
            Ringkasan Aktivitas
          </div>
          <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-b-xl border-x border-b border-gray-200 shadow-sm">
            {[
              ["Total Lowongan", "12"],
              ["Total Pelamar", "150"],
              ["Perlu Review", "24"],
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
          <div className="text-black font-medium bg-[#A2A9B0] px-4 py-3 rounded-t-xl mt-2">
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
                {[
                  ["Backend Developer", "Yogyakarta", "IT", "12", "Aktif"],
                  ["Guru Matematika", "Sleman", "Pendidikan", "8", "Aktif"],
                  ["Staff Admin", "Bantul", "Kantor", "5", "Tutup"],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td style={tdStyle}>{row[0]}</td>
                    <td style={tdStyle}>{row[1]}</td>
                    <td style={tdStyle}>{row[2]}</td>
                    <td style={tdStyle}>{row[3]} Orang</td>
                    <td style={tdStyle}>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row[4] === 'Aktif' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {row[4]}
                      </span>
                    </td>
                    <td style={tdStyleCenter}>
                      <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AKTIVITAS TERBARU */}
          <div className="text-black font-medium bg-[#A2A9B0] px-4 py-3 rounded-t-xl mt-2">
            Aktivitas Terbaru
          </div>
          <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-12 text-center border-b border-gray-100">
                    <img src={iconNotification} className="w-5 h-5 mx-auto" alt="notif" />
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <span className="font-bold text-gray-700">Budi Santoso</span> melamar posisi <span className="text-blue-600 font-medium">Backend Developer</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-12 text-center border-b border-gray-100">
                    <img src={iconCeklist} className="w-5 h-5 mx-auto" alt="check" />
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    Anda telah meloloskan <span className="font-bold text-gray-700">Siti Aminah</span> ke tahap <span className="text-green-600 font-medium">Interview</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-12 text-center">
                    <img src={iconPeringatan} className="w-5 h-5 mx-auto" alt="alert" />
                  </td>
                  <td className="p-4">
                    Lowongan <span className="font-bold text-gray-700">Staff Admin</span> telah mencapai deadline
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminAumLayout>
  );
};

export default DashboardAdminAum;