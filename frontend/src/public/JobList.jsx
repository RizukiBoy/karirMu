import { useEffect, useState } from "react";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/public/jobs?page=${pageNumber}&limit=6`
      );
      const data = await res.json();
      setJobs(data.data);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Lowongan Pekerjaan</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : jobs.length === 0 ? (
        <p>Tidak ada lowongan tersedia</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={job.company?.logo_url}
                    alt="logo"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h2 className="font-semibold">{job.job_name}</h2>
                    <p className="text-sm text-gray-500">
                      {job.company?.company_name}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600">📍 {job.location}</p>
                <p className="text-sm text-gray-600">💼 {job.type}</p>
                <p className="text-sm text-gray-600">🏷️ {job.category}</p>

                <p className="text-sm font-medium text-gray-800 mt-3">
                  💰 {job.salary_min && job.salary_max
                    ? `Rp ${job.salary_min.toLocaleString()} - Rp ${job.salary_max.toLocaleString()}`
                    : "Gaji dirahasiakan"}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="mt-4 bg-emerald-600 text-white rounded-xl py-2 hover:bg-emerald-700 transition"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* MODAL DETAIL (MANUAL, TANPA IMPORT COMPONENT) */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedJob(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-1">
              {selectedJob.job_name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedJob.company?.company_name} • {selectedJob.location}
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Deskripsi Pekerjaan</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Kualifikasi</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedJob.requirement}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedJob(null)}
              className="mt-6 w-full bg-gray-200 hover:bg-gray-300 rounded-xl py-2"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
