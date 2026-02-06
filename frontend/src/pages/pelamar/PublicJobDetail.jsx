import PelamarLayout from "../../components/layout/PelamarLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

/* ICON LOCAL */
import iconCheckCirclePelamar from "../../assets/icons/ProfilAum/check.svg";

/* ICONSAX */
import {
  User,
  Location,
  Save2,
  ArrowLeft,
  Share,
} from "iconsax-reactjs";
import ApplyJobModal from "./ApplyJobModal";

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

const formatCurrency = (num) =>
  Number(num).toLocaleString("id-ID");

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : "-";

const PublicJobDetail = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openApply, setOpenApply] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/public/jobs/${jobId}`
        );

        const data = res.data.data
        console.log(data)
        setJob(data || null);
      } catch (error) {
        console.error("Gagal mengambil detail job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [jobId]);

  if (loading) {
    return (
      <PelamarLayout>
        <div className="p-10 text-center">Memuat...</div>
      </PelamarLayout>
    );
  }

  if (!job) {
    return (
      <PelamarLayout>
        <div className="p-10 text-center">Lowongan tidak ditemukan</div>
      </PelamarLayout>
    );
  }

  return (
    <PelamarLayout>
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <div
          className="rounded-xl px-6 py-5 text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <User size="28" color="#fff" variant="Bold" />
            </div>

            <div className="h-12 w-px bg-white/40" />

            <div>
              <h2 className="text-xl font-bold">{job?.job_name}</h2>
              <p className="text-sm opacity-90">
                {job.company?.company_name || "-"}
              </p>
              <p className="text-sm">
                {job.job_field?.name || "-"} |{" "}
                {WORK_TYPE_LABEL[job.work_type] || job.work_type} |{" "}
                {JOB_TYPE_LABEL[job.type] || job.type}
              </p>
              <p className="text-sm">
                Rp {formatCurrency(job.salary_min)} – Rp{" "}
                {formatCurrency(job.salary_max)}
              </p>
              <p className="text-sm">
                Tenggat Waktu: {formatDate(job.date_job)}
              </p>
            </div>
          </div>
        </div>

        {/* ================= DESKRIPSI ================= */}
        <div className="bg-white rounded-xl shadow-sm">
          <div
            className="px-4 py-3 rounded-t-xl text-white font-medium"
            style={{
              background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
            }}
          >
            Deskripsi Pekerjaan
          </div>

          <div className="p-5 text-sm text-gray-700 leading-relaxed">
            {job.description || "-"}
          </div>
        </div>

        {/* ================= PERSYARATAN ================= */}
        <div className="bg-white rounded-xl shadow-sm">
          <div
            className="px-4 py-3 rounded-t-xl text-white font-medium"
            style={{
              background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
            }}
          >
            Persyaratan
          </div>

          <div className="p-5 text-sm text-gray-700 whitespace-pre-line">
            {job.requirement || "-"}
          </div>
        </div>

        {/* ================= ACTION ================= */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
          >
            <ArrowLeft size="18" />
            Kembali
          </button>

          <div className="flex items-center gap-5">
            <Share size="20" className="text-gray-600 cursor-pointer" />
      <button
        onClick={() => setOpenApply(true)}
        className="px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        Lamar
      </button>

      <ApplyJobModal
        isOpen={openApply}
        onClose={() => setOpenApply(false)}
        jobId={jobId}
      />
          </div>
        </div>
      </div>
    </PelamarLayout>
  );
};

export default PublicJobDetail;
