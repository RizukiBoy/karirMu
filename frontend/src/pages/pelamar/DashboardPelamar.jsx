import PelamarLayout from "../../components/layout/PelamarLayout";
import { useState, useEffect } from "react";
import axios from "axios";

// ICONS
import iconTextPelamar from "../../assets/icons/ProfilPelamar/Icon-text.svg";
import iconSecurityPelamar from "../../assets/icons/ProfilPelamar/Icon-security.svg";
import iconChecklistPelamar from "../../assets/icons/ProfilPelamar/Icon-checklist.svg";
import iconCheckCirclePelamar from "../../assets/icons/ProfilPelamar/check-circle.svg";
import iconLocationPelamar from "../../assets/icons/ProfilPelamar/location.svg";
import iconUserPelamar from "../../assets/icons/ProfilPelamar/user-profile.svg";
import iconArrowRight from "../../assets/icons/ProfilPelamar/arrow-right.svg";
import iconSavePelamar from "../../assets/icons/ProfilPelamar/save.svg";
import PublicJobCard from "../../components/users/PublicJobCard"

const rekomendasiLowongan = [
  {
    posisi: "UI/UX Designer",
    gaji: "Rp 4jt–6 jt",
    tags: ["UI/UX", "Fulltime", "Minimal (S1)", "2 jt-3 jt", "+10"],
    perusahaan: "PT. SURYA MEDIA UTAMA",
    lokasi: "Sleman, Jogja",
    waktu: "14 hari yang lalu",
  },
  {
    posisi: "UI/UX Designer",
    gaji: "Rp 2jt–4 jt",
    tags: ["UI/UX", "Fulltime", "Minimal (SMK)", "+5"],
    perusahaan: "LAZENDA",
    lokasi: "Medan, Sumatra Utara",
    waktu: "12 hari yang lalu",
  },
];


const DashboardPelamar = () => {
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    review: 0,
    accepted: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/applied-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setStats(res.data.data);
        console.log(res.data.data)
      } catch (err) {
        console.error("Gagal ambil statistik", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

    useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/public/jobs/");

        setJobs(res.data.data || []);
        console.log(res.data.data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <PelamarLayout>
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <div
          className="px-6 py-4 rounded-t-2xl text-white text-3xl font-semibold min-h-75px"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          SELAMAT DATANG PELAMAR!
        </div>

        {/* ================= STATISTIK ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TOTAL LAMARAN */}
          <div className="bg-white rounded-xl shadow-sm w-full max-w-361px h-216px mx-auto p-6 flex flex-col">
            
            {/* ICON */}
            <div className="flex">
              <div
                className="ml-8 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#409144" }}
              >
                <img
                  src={iconTextPelamar}
                  alt="total"
                  className="w-5 h-5"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-4 ml-6 text-left">
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "-" : stats.total}
            </h3>
              <p className="text-lg font-medium text-gray-700 mt-1">
                Total Lamaran
              </p>
              <span className="text-xs text-blue-600">
                +12% from yesterday
              </span>
            </div>
          </div>

          {/* SEDANG DITINJAU */}
          <div className="bg-white rounded-xl shadow-sm w-full max-w-361px h-216px mx-auto p-6 flex flex-col">
            <div className="flex">
              <div
                className="ml-8 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#409144" }}
              >
                <img
                  src={iconSecurityPelamar}
                  alt="review"
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="mt-4 ml-6 text-left">
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "-" : stats.review}
            </h3>
              <p className="text-lg font-medium text-gray-700 mt-1">
                Sedang Ditinjau
              </p>
              <span className="text-xs text-blue-600">
                +5% from yesterday
              </span>
            </div>
          </div>

          {/* LOLOS SELEKSI */}
          <div className="bg-white rounded-xl shadow-sm w-full max-w-361px h-216px mx-auto p-6 flex flex-col">
            <div className="flex">
              <div
                className="ml-8 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#409144" }}
              >
                <img
                  src={iconChecklistPelamar}
                  alt="accepted"
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="mt-4 ml-6 text-left">
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "-" : stats.accepted}
            </h3>
              <p className="text-lg font-medium text-gray-700 mt-1">
                Lolos Seleksi
              </p>
              <span className="text-xs text-blue-600">
                +8% from yesterday
              </span>
            </div>
          </div>
        </div>


        {/* ================= TIPS ================= */}
      <div
        className="px-4 py-3 rounded-t-2xl font-medium text-white"
        style={{
          background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
        }}
      >
        Tips Karir & Persiapan Tes
      </div>

<div className="bg-white shadow-sm overflow-hidden rounded-b-xl">
  {/* ITEM 1 */}
  <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
    {/* ICON */}
    <div className="w-4 h-4">
      <img
        src={iconArrowRight}
        alt="arrow"
        className="w-full h-full opacity-70"
      />
    </div>

    {/* TEXT */}
    <span className="text-lg text-gray-700">
      Cara sukses menghadapi Tes Psikotes di Kantor AUM.
    </span>
  </div>

  {/* SOFT DIVIDER */}
  <div className="mx-4 border-t border-gray-100" />

  {/* ITEM 2 */}
  <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
    <div className="w-4 h-4">
      <img
        src={iconArrowRight}
        alt="arrow"
        className="w-full h-full opacity-70"
      />
    </div>

    <span className="text-lg text-gray-700">
      Panduan Interview Tatap Muka bagi Pemula.
    </span>
  </div>
</div>

        {!loading &&
        jobs.map((job) => (
            <PublicJobCard
            key={job._id}
            job={job}
            onClick={() =>
                navigate(`/jobs/${job._id}`)}
            />
        ))}

      </div>
    </PelamarLayout>
  );
};

export default DashboardPelamar;