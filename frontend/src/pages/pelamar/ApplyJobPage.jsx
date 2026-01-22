import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ApplyJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState([]);
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

    if (role !== "pelamar") {
      alert("Hanya pelamar yang dapat melamar pekerjaan");
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        const [jobRes, docRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/public/jobs`),
          axios.get(`http://localhost:5000/api/user/document`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setJob(jobRes.data.data);
        console.log(jobRes.data.data)
        setCvUrl(docRes.data.data.resume_cv);

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
{job.length === 0 ? (
  <p className="text-sm text-gray-500">Tidak ada lowongan</p>
) : (
  job.map((item) => (
    <div
      key={item._id}
      className="border rounded p-4 mb-3"
    >
      <h3 className="font-semibold">{item.job_name}</h3>
      <p className="text-sm text-gray-600">{item.location}</p>

      <p className="text-xs text-gray-500">
        {item.job_field?.name || "-"}
      </p>
    </div>
  ))
)}

      {/* CV Section */}
<div className="border rounded-lg p-4 bg-gray-50">
  {cvUrl ? (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-green-600"></span>
        CV sudah terunggah
      </div>

      <div className="flex gap-3">
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
        >
          Lihat CV
        </a>

        <button
          onClick={() => navigate("/profile/document")}
          className="px-3 py-1.5 text-sm rounded border border-gray-400 text-gray-700 hover:bg-gray-200 transition"
        >
          Ganti CV
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-between">
      <p className="text-red-600 text-sm font-medium">
        Anda belum mengunggah CV
      </p>

      <button
        onClick={() => navigate("/profile/document")}
        className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition"
      >
        Unggah CV
      </button>
    </div>
  )}
</div>


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
