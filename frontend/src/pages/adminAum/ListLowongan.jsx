// import { useEffect, useState } from "react";
// import axios from "axios";
// import JobCard from "../../components/JobCard";
// import JobDetailModal from "../../components/JobDetailPage";
// import AdminAumLayout from "../../components/layout/AdminAumLayout";
// import { useNavigate} from "react-router-dom";
// const ListLowongan = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/admin-aum/jobs/", {
//             headers : {
//                   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             }
//           }

//         );

//         console.log(res.data.data)
//         setJobs(res.data.data || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   return (
//     <>
//     <AdminAumLayout>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {jobs.map((job) => (
//           <JobCard
//             key={job._id}
//             job={job}
//             onClick={() => navigate(`/jobs/${job._id}`)}
//           />
//         ))}
//       </div>
//     </AdminAumLayout>
//     </>
//   );
// };

// export default ListLowongan;

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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

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

        setJobs(res.data.jobs || []);
        console.log(res.data.jobs)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  function FilterSelect({ label }) {
  return (
    <select className="border rounded px-3 py-2 text-sm w-full md:w-40">
      <option>{label}: Semua</option>
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
                className="flex-1 border rounded px-3 py-2 text-sm"
              />

              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="md:hidden border rounded px-3 py-2 text-sm"
              >
                ☰
              </button>

              <div className="hidden md:flex gap-3">
                <FilterSelect label="Status" />
                <FilterSelect label="Bidang" />
                <FilterSelect label="Lokasi" />
              </div>
            </div>

      {openFilter && (
        <div className="md:hidden mt-4 space-y-3 border-t pt-4">
          <FilterSelect label="Status" />
          <FilterSelect label="Bidang" />
          <FilterSelect label="Lokasi" />
        </div>
      )}
          </div>

          {/* <JobFilter /> */}

{/* ================= DAFTAR LOWONGAN ================= */}

{/* CARD TABLE */}
{/* <div className="bg-white rounded-b-lg shadow-sm p-6">

  <div
    className="grid grid-cols-5 px-4 py-3 rounded-md text-sm font-semibold text-white mb-4 overflow-x-scroll"
    style={{
      background: "linear-gradient(90deg, #1D5F82 0%, #409144 100%)",
    }}
  >
    <div>Pekerjaan</div>
    <div>Tipe pekerjaan</div>
    <div>Tanggal Dibuat</div>
    <div>Status</div>
    <div>Aksi</div>
  </div>

{jobs.map((job) => (
  <JobCard key={job._id} job={job} onClick={() => navigate(`/admin-aum/jobs/${job._id}`)} />
))}
</div> */}

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
    <div>Tanggal Dibuat</div>
    <div>Status</div>
    <div>Aksi</div>
  </div>

  {/* ===== LIST ===== */}
  <div className="space-y-3 md:space-y-0">
    {jobs.map((job) => (
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
        Menampilkan <b>1–5</b> lowongan
      </span>

      <div className="flex gap-4">
        <button className="hover:underline">&lt; Prev</button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={page === p ? "font-bold text-green-600" : ""}
          >
            {p}
          </button>
        ))}
        <button className="hover:underline">Next &gt;</button>
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

