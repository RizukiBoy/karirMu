
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/layout/AdminAumLayout";

// ICON
import iconText from "../../assets/icons/ProfilAum/Icon-text.svg";
import iconProfile from "../../assets/icons/ProfilAum/Icon-profile.svg";

const gradientStyle = {
  background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
};

const ApplicationList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [job, setJob] = useState([])
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_applicants: 0,
    submitted: 0,
    accepted: 0,
  })
  
  const limit = 5;
  const totalPage = Math.ceil(total / limit)


    useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin-aum/applications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            params : {
              page,
              limit,
            }
          }
        );


        setApplications(res.data.data || []);
        setTotal(res.data.total)
        // console.log(res.data.data)
        // console.log(res.data.total)

      } catch (error) {
        console.error("Gagal mengambil lamaran:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [page]);

      useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin-aum/jobs/", {
            headers : {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
          }

        );

        setJob(res.data.jobs || []);

        setStats({
        total_jobs: res.data.jobs.length,
        total_applicants: res.data.total.total_applicants || 0,
        submitted: res.data.total.submitted || 0,
        accepted: res.data.total.accepted || 0,
      });

        console.log(res.data.jobs)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Memuat data lamaran...</p>;
  }

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
    <AdminLayout>
      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-1124px flex flex-col gap-4">
          {/* PAGE TITLE */}
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm font-semibold">
            Manajemen Pelamar
          </div>
          {/* ================= RINGKASAN AKTIVITAS ================= */}
          <div
            className="px-4 py-3 rounded-t-lg mb-4 font-medium text-white"
            style={{
              background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
            }}
          >
            Ringkasan Aktivitas
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {[
              { icon: iconText, total: stats.total_jobs, label: "Total Lowongan" },
              { icon: iconText, total: stats.total_applicants, label: "Total Pelamar" },
              { icon: iconProfile, total: stats.submitted, label: "Perlu Ditinjau" },
              { icon: iconProfile, total: stats.accepted, label: "Diterima" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
              >
                <img src={item.icon} className="w-10 h-10" alt="" />
                <div>
                  <h3 className="text-xl font-bold">{item.total}</h3>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

       {loading ? (
          <p className="text-gray-500">Belum ada lamaran masuk</p>
        ) : applications.length === 0 ? (
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

      <div className="bg-white rounded-lg shadow-sm px-6 py-4 flex justify-between items-center text-sm text-gray-600">
      <span>
        Menampilkan{" "}
        <b>
          {total === 0
            ? 0
            : (page - 1) * limit + 1}–
          {Math.min(page * limit, total)}
        </b>{" "}
        pelamar
      </span>

                <div className="flex gap-4 items-center">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="disabled:opacity-40"
                >
                  &lt; Prev
                </button>

                {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2 ${
                      page === p ? "font-bold text-green-600" : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPage}
                  className="disabled:opacity-40"
                >
                  Next &gt;
                </button>
              </div>
      </div>

      <div
        className="px-4 py-3 rounded-t-lg mb-4 font-medium text-white"
        style={{
          background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
        }}
      >
        Daftar Lowongan & Pelamar
      </div>

      <div className="bg-white rounded-b-lg shadow-sm p-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-sm text-gray-500">
            Tidak ada lowongan
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {job.map((item) => (
              <div
                key={item._id}
                className="
                  bg-white rounded-xl p-4 flex flex-col justify-between
                  border border-gray-200 shadow-sm hover:shadow-md transition
                "
              >
                {/* INFO LOWONGAN */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-gray-800">
                    {item.job_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Lokasi: {item.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    Bidang: {item.job_field_name}
                  </p>
                </div>

                {/* FOOTER CARD */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    👥 {item.total_applicants} Pelamar
                  </span>

                  <button
                    onClick={() =>
                      navigate("/admin-aum/lihat-pelamar", {
                        state: { jobId: item._id, jobName: item.job_name},
                      })
                    }
                    className="
                      border border-green-600 text-green-600
                      px-4 py-1.5 rounded-full text-xs font-semibold
                      hover:bg-green-600 hover:text-white transition
                    "
                  >
                    Lihat Pelamar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApplicationList;