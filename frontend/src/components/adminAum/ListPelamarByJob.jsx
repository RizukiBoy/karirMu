import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ListPelamarByJob() {
  const navigate = useNavigate();
  const location = useLocation();

  // ======================
  // 1️⃣ Ambil state dari navigate
  // ======================
  const { jobId, jobName } = location.state || {};

  // ======================
  // 2️⃣ State
  // ======================
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // 3️⃣ Fetch applicants
  // ======================
const fetchApplicants = async () => {
  if (!jobId) return;

  try {
    setLoading(true);

    const res = await axios.get(
      "http://localhost:5000/api/admin-aum/applications",
      {
        params: { jobId }, // 🔥 INI KUNCI UTAMA
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setApplicants(res.data?.data || []);
    console.log("JOB ID DI FRONTEND:", jobId);

    
  } catch (err) {
    console.error("Gagal mengambil pelamar:", err);
  } finally {
    setLoading(false);
  }
};



  // ======================
  // 4️⃣ Effect
  // ======================
  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  // ======================
  // 5️⃣ Guard jika state kosong
  // ======================
  if (!jobId) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">
          Data lowongan tidak ditemukan
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 text-sm text-blue-600"
        >
          Kembali
        </button>
      </div>
    );
  }

  // ======================
  // 6️⃣ Render
  // ======================

    function StatusBadge({ status }) {
  const map = {
    submitted: "bg-gray-200 text-gray-700",
    reviewed: "bg-blue-100 text-blue-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}
  return (
    <>
       {loading ? (
          <p className="text-gray-500">Belum ada lamaran masuk</p>
        ) : applicants.length === 0 ? (
          <div className="text-sm text-gray-500">
           Tidak ada pelamar
          </div>
            ) : (
          <div className="overflow-x-auto rounded-t-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-white" 
                  style={{
                  background: "linear-gradient(90deg, #1D5F82 0%, #409144 100%)",
                  }}>
                  <th className="p-3">Nama Pelamar</th>
                  <th className="p-3">Posisi</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Aksi</th>
                  <th className="p-3"></th>

                </tr>
              </thead>

              <tbody>
                {applicants.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium">
                        {app.applicant?.full_name || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.applicant?.email}
                      </p>
                    </td>

                    <td className="p-3">
                      <p className="font-medium">
                        {app.job?.job_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.job?.location}
                      </p>
                    </td>

                    <td className="p-3">
                      {new Date(app.apply_date).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-3">
                      <StatusBadge status={app.apply_status} />
                    </td>

                    <td className="p-3">
                      <a
                        href={app.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Lihat CV
                      </a>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(`/admin-aum/list-pelamar/${app._id}`)
                        }
                        className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  );
}
