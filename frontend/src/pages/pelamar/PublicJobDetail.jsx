import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JOB_TYPE_LABEL = {
  full_time: "Penuh Waktu",
  part_time: "Paruh Waktu",
  internship: "Magang",
  contract: "Kontrak",
  freelance: "Freelance",
};

const WORK_TYPE_LABEL = {
  onsite: "Di Kantor",
  remote: "Remote",
  hybrid: "Fleksibel",
};

export default function PublicJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/public/jobs/${jobId}`
        );
        const dataArray = res.data.data || [];
        const jobDetail = dataArray.find(job=> job._id === jobId)
        setJob(jobDetail || null);

        console.log(jobDetail)
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{job?.job_name || "-"}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {job?.company?.company_name || "-"}
        </p>
      </div>

      {/* INFO UTAMA */}
      <div className="flex justify-between bg-white rounded-lg p-6 shadow-sm text-sm space-y-2">
        <div>

        <p><span className="text-gray-500">Tipe Kerja</span> : {JOB_TYPE_LABEL[job?.type]}</p>
        <p><span className="text-gray-500">Lokasi</span> : {job.location}</p>
        </div>
        <div>
        <p><span className="text-gray-500">Tipe Pekerjaan</span> : {WORK_TYPE_LABEL[job.work_type]}</p>
        <p><span className="text-gray-500">Bidang</span> : {job.job_field?.name || "-"}</p>
        </div>
      </div>

      {/* DESKRIPSI */}
      <section>
        <h2 className="font-semibold mb-2">Deskripsi Pekerjaan</h2>
        <div className="bg-white p-4 rounded shadow-sm text-sm leading-relaxed">
          {job.description}
        </div>
      </section>

      {/* PERSYARATAN */}
      <section>
        <h2 className="font-semibold mb-2">Persyaratan</h2>
        <div className="bg-white p-4 rounded shadow-sm text-sm whitespace-pre-line">
          {job.requirement}
        </div>
      </section>

      {/* GAJI */}
      <section className="bg-white p-4 rounded shadow-sm text-sm">
        <p>
          <span className="text-gray-500">Rentang Gaji</span> :{" "}
          {job.salary_min && job.salary_max
            ? `Rp ${Number(job.salary_min).toLocaleString("id-ID")} - Rp ${Number(job.salary_max).toLocaleString("id-ID")}`
            : "Dirahasiakan"}
        </p>

        <p className="mt-1">
          <span className="text-gray-500">Tenggat</span> :{" "}
          {job.date_job
            ? new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(job.date_job))
            : "-"}
        </p>
      </section>

      {/* ACTION */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 border border-gray-300 py-3 rounded-xl"
        >
          Kembali
        </button>

        <button
          onClick={() => navigate(`/jobs/${jobId}/apply`)}
          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Lamar Pekerjaan
        </button>
      </div>
    </div>
  );
}
