import { useState, useEffect } from "react";
import axios from "axios";
import FilterSelect from "./filterSelect"; // pastikan komponen ini ada

// FilterSelect.jsx

export default function JobFilter({ onJobsFetched }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & search state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [jobField, setJobField] = useState("");
  const [location, setLocation] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  // =======================
  // Fetch jobs dari API
  // =======================
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = { page, limit };
      if (search) params.search = search;
      if (status) params.status = status;
      if (jobField) params.job_field = jobField;
      if (location) params.location = location;

      const res = await axios.get("http://localhost:5000/api/admin-aum/jobs", {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      const data = res.data.data || [];
      setJobs(data);
      setTotalPage(res.data.total_pages || 1);

      if (onJobsFetched) onJobsFetched(data); // callback ke parent
    } catch (err) {
      console.error("Gagal mengambil lowongan:", err);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // Effect: fetch saat filter/search/page berubah
  // =======================
  useEffect(() => {
    fetchJobs();
  }, [search, status, jobField, location, page]);

  return (
    <div className="bg-white p-4 rounded-b-lg shadow-sm space-y-4 items-center">
      {/* Search & Filters */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Cari Lowongan"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={() => setOpenFilter(!openFilter)}
          className="md:hidden border rounded px-3 py-2 text-sm"
        >
          ☰
        </button>

        <div className="hidden md:flex gap-3">
          <FilterSelect label="Status" value={status} onChange={setStatus} />
          <FilterSelect label="Bidang" value={jobField} onChange={setJobField} />
          <FilterSelect label="Lokasi" value={location} onChange={setLocation} />
        </div>
      </div>

      {/* Mobile Filters */}
      {openFilter && (
        <div className="md:hidden mt-4 space-y-3 border-t pt-4">
          <FilterSelect label="Status" value={status} onChange={setStatus} />
          <FilterSelect label="Bidang" value={jobField} onChange={setJobField} />
          <FilterSelect label="Lokasi" value={location} onChange={setLocation} />
        </div>
      )}

      {/* Job List */}
      {loading ? (
        <p className="text-center py-10">Memuat...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center py-10">Tidak ada lowongan ditemukan</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-base">{job.job_name}</h3>
              <p className="text-sm text-gray-500">Lokasi: {job.location}</p>
              <p className="text-sm text-gray-500">Bidang: {job.job_field?.name || "-"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <span>Halaman {page} / {totalPage}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
          disabled={page === totalPage}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
