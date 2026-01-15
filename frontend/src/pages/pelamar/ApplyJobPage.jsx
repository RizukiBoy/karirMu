import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ApplyJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    if (role !== "applicant") {
      alert("Hanya pelamar yang dapat melamar pekerjaan");
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        const [jobRes, docRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/jobs/${jobId}`),
          axios.get(`http://localhost:5000/api/user/document`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setJob(jobRes.data.data);
        setCvUrl(docRes.data.resume_cv || null);
      } catch (error) {
        alert("Gagal memuat data lamaran");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleApply = async () => {
    if (!cvUrl) {
      alert("Anda harus mengunggah CV terlebih dahulu");
      navigate("/user/profile");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lamaran berhasil dikirim");
      navigate("/user/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengirim lamaran");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Memuat...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Konfirmasi Lamaran</h1>

      {/* Job Info */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold text-lg mb-2">{job.job_name}</h2>
        <p className="text-sm text-gray-500">
          {job.company?.company_name} • {job.location}
        </p>
      </section>

      {/* CV Section */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold mb-3">CV yang Digunakan</h3>

        {cvUrl ? (
          <div className="flex items-center justify-between">
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Lihat CV
            </a>

            <button
              onClick={() => navigate("/profile/document")}
              className="text-sm text-gray-600 hover:underline"
            >
              Ganti CV
            </button>
          </div>
        ) : (
          <div className="text-red-600 text-sm">
            Anda belum mengunggah CV
          </div>
        )}
      </section>

      {/* Action */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-200 rounded-xl py-3"
        >
          Batal
        </button>

        <button
          onClick={handleApply}
          disabled={!cvUrl || submitting}
          className={`flex-1 rounded-xl py-3 text-white transition
            ${
              !cvUrl || submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          `}
        >
          {submitting ? "Mengirim..." : "Kirim Lamaran"}
        </button>
      </div>
    </div>
  );
};

export default ApplyJobPage;
