import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateCV from "../../components/users/UpdateCV";
import { DocumentUpload } from "iconsax-reactjs";

const ApplyJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState([]);
  const [cvUrl, setCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openCVModal, setOpenCVModal] = useState(false);

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
          axios.get(`http://localhost:5000/api/public/jobs/${jobId}`),
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

      setShowSuccessModal(true); 
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

      {/* ================= JOB INFO ================= */}
      {job && (
        <div className="border rounded p-4 mb-4">
          <h3 className="font-semibold">{job.job_name}</h3>
          <p className="text-sm text-gray-600">{job.location}</p>
          <p className="text-xs text-gray-500">
            {job.job_field?.name || "-"}
          </p>
        </div>
      )}

      {/* ================= CV INFO ================= */}
      <div className="border rounded-lg p-4 bg-gray-50 mb-6">
        {cvUrl ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-600" />
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
                onClick={() => setOpenCVModal(true)}
                className="px-3 py-1.5 text-sm rounded border border-gray-400 text-gray-700 hover:bg-gray-200 transition"
              >
                Ganti CV
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-600 text-sm font-medium">
            Anda belum mengunggah CV
          </p>
        )}
      </div>

      {/* ================= ACTION BUTTON ================= */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-200 rounded-xl py-3"
        >
          Batal
        </button>

        <button
          onClick={() => setShowApplyModal(true)}
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

      {/* ================= APPLY CONFIRM MODAL ================= */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b text-center">
              <h2 className="text-2xl font-black text-gray-900">
                Lamar Posisi {job.job_name}
              </h2>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-gray-600 text-sm">
                CV yang tersimpan akan digunakan untuk melamar pekerjaan ini.
              </p>

              <div className="border-2 border-dashed border-blue-400 rounded-2xl p-5 bg-blue-50 flex items-center gap-4">
                <DocumentUpload size={24} color="#2563eb" variant="Bold" />
                <div>
                  <p className="font-bold text-blue-700 text-sm">
                    CV Tersimpan
                  </p>
                  <p className="text-xs text-gray-500">
                    Klik "Ganti CV" jika ingin upload ulang
                  </p>
                </div>
              </div>

              <p className="text-sm">
                Ingin{" "}
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setOpenCVModal(true);
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  mengganti CV?
                </button>
              </p>
            </div>

            <div className="p-6 flex justify-end gap-4">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-6 py-3 border-2 border-gray-300 font-bold rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={handleApply}
                disabled={submitting}
                className="px-10 py-3 bg-[#43934B] text-white font-bold rounded-xl shadow-lg disabled:opacity-60"
              >
                {submitting ? "Mengirim..." : "Kirim Lamaran"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPDATE CV MODAL ================= */}
      <UpdateCV
        isOpen={openCVModal}
        onClose={() => setOpenCVModal(false)}
        onSuccess={(newCvUrl) => {
          setCvUrl(newCvUrl);
          setOpenCVModal(false);
          setShowApplyModal(true);

        }}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center space-y-6">
            <div className="flex justify-center">
              <TickCircle size={100} color="#43934B" variant="Bold" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 uppercase">
              Lamaran Berhasil Dikirim!
            </h2>

            <p className="text-sm text-gray-500">
              Lamaran Anda telah diterima. Silakan cek riwayat lamaran Anda.
            </p>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => navigate("/pelamar/riwayat-lamaran")}
                className="w-full py-3 border-2 border-[#43934B] text-[#43934B] font-bold rounded-xl"
              >
                Lihat Riwayat
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/user/dashboard");
                }}
                className="w-full py-3 bg-[#43934B] text-white font-bold rounded-xl"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplyJobPage;
