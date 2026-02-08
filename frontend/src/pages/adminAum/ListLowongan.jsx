
import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../components/JobCard";
import JobDetailModal from "../../components/JobDetailPage";
import AdminAumLayout from "../../components/layout/AdminAumLayout";
import { useNavigate} from "react-router-dom";
import JobFilter from "../../components/adminAum/JobFilter";

export default function ListLowongan() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState({
  status: "all",
  field: "all",
  location: "all",
});


    useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin-aum/jobs/", {
            headers : {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          params: {
            page,
            limit,
            search,
            job_field: filters.job_field_name,
            location: filters.location,
            status: filters.status,
          },
          }

        );

        setJobs(res.data.jobs || []);
        setTotalPages(res.data.total_pages || 1);
        console.log(res.data.jobs)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, search, filters]);

const fieldOptions = [
  ...new Set(jobs.map((j) => j.job_field_name)),
].map((name) => ({
  value: name,
  label: name,
}));


const locationOptions = [
  ...new Set(jobs.map((j) => j.location)),
].map((loc) => ({
  value: loc,
  label: loc,
}));


const filteredJobs = jobs.filter((job) => {
  // SEARCH
  if (
    debouncedSearch &&
    !job.job_name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) {
    return false;
  }

  // STATUS
  if (filters.status !== "all") {
    const isActive = job.status === true;
    if (filters.status === "active" && !isActive) return false;
    if (filters.status === "inactive" && isActive) return false;
  }

  // BIDANG
if (
  filters.field !== "all" &&
  job.job_field_name !== filters.field
) {
  return false;
}


  // LOKASI
  if (
    filters.location !== "all" &&
    job.location !== filters.location
  ) {
    return false;
  }

  return true;
});

useEffect(() => {
  const timeout = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500); // ⏱️ 500ms delay

  return () => clearTimeout(timeout);
}, [search]);



function FilterSelect({ label, value, options = [], onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 text-sm w-full md:w-40"
    >
      <option value="all">{label}: Semua</option>

      {options.map((opt) => (
        <option
          key={`${label}-${opt.value}`}
          value={opt.value}
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}


  return (
    <AdminAumLayout>
      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-1124px flex flex-col gap-4">

          {/* PAGE TITLE */}
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm font-semibold">
            Manajemen Lowongan
          </div>

          {/* ================= FILTER ================= */}
          <div
            className="px-4 py-2.5 rounded-t-lg font-medium text-white"
            style={{
              background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
            }}
          >
            Filter Lowongan
          </div>

           <div className="bg-white p-4 rounded-b-lg shadow-sm">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Cari Lowongan"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border border-1 rounded px-3 py-2 text-sm"
              />

              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="md:hidden border rounded px-3 py-2 text-sm"
              >
                ☰
              </button>

              <div className="hidden md:flex gap-3">
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onChange={(val) =>
                      setFilters((f) => ({ ...f, status: val }))
                    }
                    options={[
                      { value: "active", label: "Aktif" },
                      { value: "inactive", label: "Non-Aktif" },
                    ]}
                  />

                  <FilterSelect
                    label="Bidang"
                    value={filters.field}
                    onChange={(val) =>
                      setFilters((f) => ({ ...f, field: val }))
                    }
                    options={fieldOptions}
                  />

                  <FilterSelect
                    label="Lokasi"
                    value={filters.location}
                    onChange={(val) =>
                      setFilters((f) => ({ ...f, location: val }))
                    }
                    options={locationOptions}
                  />
              </div>
            </div>

            {openFilter && (
              <div className="md:hidden mt-4 space-y-3 border-t pt-4">
                <FilterSelect
                  label="Status"
                  value={filters.status}
                  onChange={(v) =>
                    setFilters((f) => ({ ...f, status: v }))
                  }
                  options={[
                    { value: "active", label: "Aktif" },
                    { value: "inactive", label: "Non-Aktif" },
                  ]}
                />

                <FilterSelect
                  label="Bidang"
                  value={filters.field}
                  onChange={(v) =>
                    setFilters((f) => ({ ...f, field: v }))
                  }
                  options={fieldOptions}
                />

                <FilterSelect
                  label="Lokasi"
                  value={filters.location}
                  onChange={(v) =>
                    setFilters((f) => ({ ...f, location: v }))
                  }
                  options={locationOptions}
                />
              </div>
            )}

          </div>

          <div className="bg-white rounded-b-lg shadow-sm p-6">

            {/* ===== HEADER KOLOM (DESKTOP ONLY) ===== */}
            <div
              className="
                hidden md:grid
                grid-cols-5
                px-4 py-3 rounded-md
                text-sm font-semibold text-white mb-4
              "
              style={{
                background: "linear-gradient(90deg, #1D5F82 0%, #409144 100%)",
              }}
            >
              <div>Pekerjaan</div>
              <div>Tipe pekerjaan</div>
              <div>Aktif Sampai</div>
              <div>Status</div>
              <div>Aksi</div>
            </div>

            {/* ===== LIST ===== */}
            <div className="space-y-3 md:space-y-0">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() => navigate(`/admin-aum/jobs/${job._id}`)}
                />
              ))}
            </div>
          </div>

    {/* PAGINATION CARD */}
<div className="bg-white rounded-lg shadow-sm px-6 py-4 flex justify-between items-center text-sm text-gray-600">
  <span>
    Halaman <b>{page}</b> dari <b>{totalPages}</b>
  </span>

  <div className="flex gap-2">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="disabled:opacity-50 hover:underline"
    >
      &lt; Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={
          page === p
            ? "font-bold text-green-600"
            : "hover:underline"
        }
      >
        {p}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="disabled:opacity-50 hover:underline"
    >
      Next &gt;
    </button>
  </div>
</div>


    {/* BUTTON CARD */}
        <div className="bg-white rounded-lg shadow-sm px-6 py-4 flex justify-end">
          <button
            onClick={() => navigate("/buat-lowongan")}
            className="
              bg-green-600
              text-white
              px-5
              py-2
              rounded-lg
              text-sm
              font-semibold
              hover:bg-green-700
              transition
            "
          >
            + Buat Lowongan Baru
          </button>
        </div>

        </div>
      </div>
    </AdminAumLayout>
  );
}

