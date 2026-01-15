import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JobEditForm from "./adminAum/JobEditForm";
import ApplyJobButton from "./ApplyJobButton";

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const canEditJob = () => {
    const role = localStorage.getItem("role");
    return role === "company_hrd";
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={job.company?.logo_url || "/placeholder-company.png"}
          alt="logo"
          className="w-16 h-16 object-contain rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{job.job_name}</h1>
          <p className="text-gray-500 text-sm">
            {job.company?.company_name} • {job.location}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Kembali anjay
        </button>
      </div>

      {/* BODY */}
      <div className="bg-white rounded-2xl shadow p-6">
        {editMode ? (
          <JobEditForm
            job={job}
            onCancel={() => setEditMode(false)}
            onSuccess={(updatedJob) => {
              setJob(updatedJob);
              setEditMode(false);
            }}
          />
        ) : (
          <div className="space-y-8">
            {/* INFO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Info label="Lokasi" value={job.location} />
              <Info label="Tipe" value={formatJobType(job.type)} />
              <Info label="Bidang" value={job.job_field?.name} />
              <Info
                label="Gaji"
                value={
                  job.salary_min && job.salary_max
                    ? `Rp ${job.salary_min.toLocaleString()} - Rp ${job.salary_max.toLocaleString()}`
                    : "Dirahasiakan"
                }
              />
            </div>

            {/* DESKRIPSI */}
            {job.description && (
              <section>
                <h3 className="font-semibold mb-2">Deskripsi Pekerjaan</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </section>
            )}

            {/* KUALIFIKASI */}
            <section>
              <h3 className="font-semibold mb-2">Kualifikasi</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.requirement || "-"}
              </p>
            </section>
          </div>
        )}
      </div>

      {/* ACTION */}
      {!editMode && (
        <div className="mt-6 flex gap-4">
          <ApplyJobButton jobId={job._id} />

          {canEditJob() && (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Edit Lowongan
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* =======================
   Helpers
======================= */

const Info = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "-"}</p>
  </div>
);

const formatJobType = (type) => {
  switch (type) {
    case "full_time":
      return "Penuh Waktu";
    case "part_time":
      return "Paruh Waktu";
    case "internship":
      return "Magang";
    case "contract":
      return "Kontrak";
    case "freelance":
      return "Freelance";
    default:
      return type;
  }
};

export default JobDetailPage;
