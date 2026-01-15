import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminAumLayout from "../../components/layout/AdminAumLayout";

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin-aum/applications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setApplications(res.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil lamaran:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Memuat data lamaran...</p>;
  }

  return (
    <AdminAumLayout>
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-6">
          Daftar Lamaran Masuk
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-500">Belum ada lamaran masuk</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="p-3">Pelamar</th>
                  <th className="p-3">Lowongan</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">CV</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
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
      </div>
    </AdminAumLayout>
  );
}

/* =======================
   STATUS BADGE
======================= */
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
