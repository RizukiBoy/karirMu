
// import JobEditForm from "./adminAum/JobEditForm";
// import ApplyJobButton from "./ApplyJobButton";

// const JobDetailPage = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();

//   const [editMode, setEditMode] = useState(false);
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const canEditJob = () => {
//     const role = localStorage.getItem("role");
//     return role === "company_hrd";
//   };

// 
//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       {/* HEADER */}
//       <div className="flex items-center gap-4 mb-6">
//         <img
//           src={job.company?.logo_url || "/placeholder-company.png"}
//           alt="logo"
//           className="w-16 h-16 object-contain rounded"
//         />
//         <div className="flex-1">
//           <h1 className="text-2xl font-bold">{job.job_name}</h1>
//           <p className="text-gray-500 text-sm">
//             {job.company?.company_name} • {job.location}
//           </p>
//         </div>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
//         >
//           Kembali anjay
//         </button>
//       </div>

//       {/* BODY */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         {editMode ? (
//           <JobEditForm
//             job={job}
//             onCancel={() => setEditMode(false)}
//             onSuccess={(updatedJob) => {
//               setJob(updatedJob);
//               setEditMode(false);
//             }}
//           />
//         ) : (
//           <div className="space-y-8">
//             {/* INFO GRID */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <Info label="Lokasi" value={job.location} />
//               <Info label="Tipe" value={formatJobType(job.type)} />
//               <Info label="Bidang" value={job.job_field?.name} />
//               <Info
//                 label="Gaji"
//                 value={
//                   job.salary_min && job.salary_max
//                     ? `Rp ${job.salary_min.toLocaleString()} - Rp ${job.salary_max.toLocaleString()}`
//                     : "Dirahasiakan"
//                 }
//               />
//             </div>

//             {/* DESKRIPSI */}
//             {job.description && (
//               <section>
//                 <h3 className="font-semibold mb-2">Deskripsi Pekerjaan</h3>
//                 <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//                   {job.description}
//                 </p>
//               </section>
//             )}

//             {/* KUALIFIKASI */}
//             <section>
//               <h3 className="font-semibold mb-2">Kualifikasi</h3>
//               <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//                 {job.requirement || "-"}
//               </p>
//             </section>
//           </div>
//         )}
//       </div>

//       {/* ACTION */}
//       {!editMode && (
//         <div className="mt-6 flex gap-4">
//           <ApplyJobButton jobId={job._id} />

//           {canEditJob() && (
//             <button
//               onClick={() => setEditMode(true)}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
//             >
//               Edit Lowongan
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// /* =======================
//    Helpers
// ======================= */

// const Info = ({ label, value }) => (
//   <div className="bg-gray-50 rounded-xl p-4">
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="font-medium text-gray-800">{value || "-"}</p>
//   </div>
// );

// export default JobDetailPage;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminAumLayout from "../components/layout/AdminAumLayout";

// ICON
import closeIcon from "../assets/icons/iconClose.svg";
import userIcon from "../assets/icons/iconUser.svg";
import JobEditForm from "./adminAum/JobEditForm";

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [isActive, setIsActive] = useState(job.status);

 const JOB_TYPE_LABEL = {
  full_time: "Penuh Waktu",
  part_time: "Paruh Waktu",
  internship: "Magang",
  contract: "Kontrak",
  freelance: "Freelance",
};

const formatJobType = (type) => {
  return JOB_TYPE_LABEL[type] ?? type;
};

const WORK_TYPE_LABEL = {
  onsite: "Di Kantor",
  remote: "Remote",
  hybrid: "Fleksibel",
};

const formatWorkType = (type) => {
  return WORK_TYPE_LABEL[type] ?? type;
};



  const [job, setJob] = useState({
  job_name: "",
  work_type: "",
  location: "",
  type: "",
  salary_min: "",
  salary_max: "",
  date_job: "",
  description: "",
  requirement: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;

  setJob((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const handleSave = async () => {
  try {
    const payload = {
      ...job,
      salary_min: job.salary_min ? Number(job.salary_min) : null,
      salary_max: job.salary_max ? Number(job.salary_max) : null,
    };

    const res = await fetch(`http://localhost:5000/api/admin-aum/jobs/${job._id}`, {
      method: job._id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan data");
    }

    const result = await res.json();
    console.log("Saved:", result);

    // optional UX
    alert("Data berhasil disimpan");
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat menyimpan data");
  }
};



    useEffect(() => {
    if (!jobId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin-aum/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setJob(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [jobId]);

  if (loading) {
    return <div className="p-10 text-center">Memuat...</div>;
  }

  if (!job) {
    return <div className="p-10 text-center">Lowongan tidak ditemukan</div>;
  }

  const handleToggleStatus = async () => {
  try {
    setLoading(true);

    const newStatus = !job.status;

    await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    setJob((prev) => ({
      ...prev,
      status: newStatus,
    }));
    setShowConfirm(false);
  } catch (error) {
    console.error("Gagal menonaktifkan lowongan", error);
  } finally {
    setLoading(false);
  }
  };



  // Contoh state form edit

  return (
    <AdminAumLayout>
      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-1124px flex flex-col gap-4">

          {/* HEADER */}
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm flex items-center gap-2">
            <span className="text-gray-500">Manajemen Lowongan</span>
            <span className="text-gray-400">›</span>
            <span className="font-semibold">Detail Lowongan</span>
          </div>

          {/* INFORMASI UTAMA */}
          <div className="px-4 py-3 rounded-t-lg font-medium text-white"
            style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}
          >
            Informasi Utama
          </div>
          <div className="bg-white rounded-b-lg p-6 shadow-sm text-sm space-y-4">
            <div>
              <p className="font-semibold">{job.job_name}</p>
            </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* KOLOM KIRI */}
  <div className="grid grid-cols-2 gap-x-4">
    <div className="text-gray-500 space-y-2">
      <p>Tipe Kerja</p>
      <p>Lokasi</p>
      <p>Tipe Pekerjaan</p>
    </div>

    <div className="space-y-2">
      <p>: {formatJobType(job.type)}</p>
      <p>: {job.location}</p>
      <p>: {formatWorkType(job.work_type)}</p>
    </div>
  </div>

  {/* KOLOM KANAN — DISAMAKAN */}
  <div className="grid grid-cols-2 gap-x-4">
    <div className="text-gray-500 space-y-2">
      <p>Bidang</p>
      <p>Rentang Gaji</p>
      <p>Tenggat Waktu</p>
    </div>

    <div className="space-y-2">
      <p>
        : {job.job_field?.name || job.job_field_name || "-"}
      </p>

      <p className="">
        : {job.salary_min && job.salary_max
          ? `Rp ${Number(job.salary_min).toLocaleString("id-ID")} - Rp ${Number(
              job.salary_max
            ).toLocaleString("id-ID")}`
          : "Dirahasiakan"}
      </p>

      <p>
        : {job?.created_at
          ? new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(job.created_at))
          : "-"}
      </p>
    </div>
  </div>

</div>

          </div>

          {/* DESKRIPSI */}
          <div className="px-4 py-3 rounded-t-lg font-medium text-white"
            style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}
          >
            Deskripsi Pekerjaan
          </div>
          <div className="bg-white rounded-b-lg p-4 shadow-sm text-sm leading-relaxed space-y-4">
            {job.description}
          </div>

          {/* PERSYARATAN */}
          <div className="px-4 py-3 rounded-t-lg font-medium text-white"
            style={{ background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)" }}
          >
            Persyaratan
          </div>
          <div className="bg-white rounded-b-lg p-4 shadow-sm text-sm space-y-2">
            {job.requirement}
          </div>

          {/* BUTTON ACTION */}
          <div className="bg-white rounded-md p-4 shadow-sm flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="border border-green-600 text-green-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-600 hover:text-white transition"
            >
              Kembali
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Edit Lowongan
              </button>

            {job?.status ? (
              <button
                onClick={handleToggleStatus}
                className="flex-1 p-3 rounded-lg font-semibold text-white transition bg-red-600 hover:bg-red-700"
              >
                Nonaktifkan
              </button>
            ) : (
              <button
                onClick={handleToggleStatus}
                className="flex-1 p-3 rounded-lg font-semibold text-white transition bg-emerald-600 hover:bg-emerald-700"
              >
                Aktifkan
              </button>
            )}


            </div>
          </div>
        </div>

     {/* BODY */}
    {/* <div className="overflow-y-auto px-6 py-4">
      <JobEditForm
        job={job}
        onCancel={() => setShowEditModal(false)}
        onSuccess={(updatedJob) => {
          setJob(updatedJob);
          setShowEditModal(false);
        }}
      />
</div> */}


        {/* ================= MODAL EDIT ================= */}
{/* {showEditModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-lg grid grid-rows-[auto_1fr_auto] overflow-hidden">

      <div
        className="px-5 py-3 text-white font-semibold flex justify-between items-center"
        style={{ background: "linear-gradient(90deg, #004F8F, #009B49)" }}
      >
        Edit Lowongan
        <img
          src={closeIcon}
          className="w-4 h-4 cursor-pointer filter invert"
          onClick={() => setShowEditModal(false)}
          alt="close"
        />
      </div>

      <div className="overflow-y-auto px-6 py-4 space-y-4 text-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Judul Lowongan" name="title" value={job.job_name} onChange={handleChange} />
          <Input label="Tipe Kerja" name="tipeKerja" value={job.type} onChange={handleChange} />
          <Input label="Lokasi" name="lokasi" value={job.location} onChange={handleChange} />
          <Input label="Tipe Pekerjaan" name="tipePekerjaan" value={job.work_type} onChange={handleChange} />
          <Input label="Rentang Gaji" name="gaji" value={job.salary_min} onChange={handleChange} />
          <Input label="Rentang Gaji" name="gaji" value={job.salary_max} onChange={handleChange} />
          <Input label="Tenggat Waktu" name="tenggat" value={job.date_job} onChange={handleChange} />
        </div>

        <div>
          <label className="text-gray-500 text-xs">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={job.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="text-gray-500 text-xs mb-1 block">Persyaratan</label>
          <textarea
            name="persyaratan"
            value={job.requirement}
            onChange={(e) => setFormData({ ...job, persyaratan: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Tuliskan persyaratan, pisahkan baris jika perlu"
          />
        </div>

      </div>

      <div className="px-6 pb-4 bg-white">
        <div className="border-t border-gray-200/70 my-4"></div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#409144] text-white rounded text-sm font-semibold hover:bg-[#367a3a] transition"
          >
            Simpan
          </button>
        </div>
      </div>

    </div>
  </div>
)} */}


{showEditModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-lg grid grid-rows-[auto_1fr_auto] overflow-hidden">

      {/* HEADER */}
      <div
        className="px-5 py-3 text-white font-semibold flex justify-between items-center"
        style={{ background: "linear-gradient(90deg, #004F8F, #009B49)" }}
      >
        Edit Lowongan
        <img
          src={closeIcon}
          className="w-4 h-4 cursor-pointer filter invert"
          onClick={() => setShowEditModal(false)}
          alt="close"
        />
      </div>

      {/* BODY → ISI DARI JobEditForm */}
      <div className="overflow-y-auto px-6 py-4">
        <JobEditForm
          job={job}
          onCancel={() => setShowEditModal(false)}
          onSuccess={(updatedJob) => {
            setJob(updatedJob);
            setShowEditModal(false);
          }}
        />
      </div>

    </div>
  </div>
)}



        {/* ================= POPUP KONFIRMASI NONAKTIFKAN ================= */}
{showConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
      
      {/* Judul */}
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold text-center">
          Konfirmasi Perubahan
        </h2>
      </div>

      <div className="px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Isi */}
      <div className="px-10 py-4 text-sm text-gray-700 space-y-4">
        <p>
          Apakah Anda yakin ingin{" "}
          <b>{job?.status ? "menonaktifkan" : "mengaktifkan"}</b> lowongan{" "}
          "<b>{job?.job_name}</b>"?
        </p>

        <p className="text-gray-500 text-xs">
          {job?.status
            ? "Pelamar tidak akan bisa melihat atau melamar pada lowongan ini setelah dinonaktifkan."
            : "Lowongan ini akan kembali tampil dan bisa dilamar oleh pelamar."}
        </p>
      </div>

      <div className="px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Tombol */}
      <div className="px-6 py-4 flex gap-4">
        <button
          onClick={() => setShowConfirm(false)}
          className="flex-1 border border-gray-400 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50"
        >
          Batal
        </button>

        <button
          onClick={handleToggleStatus} 
          className={`flex-1 py-2.5 rounded-lg font-semibold text-white transition
            ${
              job?.status
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          `}
        >
          {job?.status ? "Nonaktifkan" : "Aktifkan"}
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </AdminAumLayout>
  );
}

// ===================== Input Component =====================
const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-xs">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"/>
  </div>
);
