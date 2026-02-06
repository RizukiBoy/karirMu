import { useEffect, useState } from "react";
import axios from "axios";
import UpdateCV from "../../components/users/UpdateCV";
import { DocumentUpload, TickCircle } from "iconsax-reactjs";

const ApplyJobModal = ({ isOpen, onClose, jobId }) => {
  const [job, setJob] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openCVModal, setOpenCVModal] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [jobRes, docRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/public/jobs/${jobId}`),
          axios.get(`http://localhost:5000/api/user/document`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setJob(jobRes.data.data);
        setCvUrl(docRes.data.data.resume_cv);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, jobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-10 text-center">Memuat...</div>
        ) : (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">
              Konfirmasi Lamaran
            </h1>

            {/* JOB INFO */}
            <div className="border rounded p-4 mb-4">
              <h3 className="font-semibold">{job.job_name}</h3>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>

            {/* CV INFO */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              {cvUrl ? (
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium text-sm">
                    CV sudah terunggah
                  </span>
                  <button
                    onClick={() => setOpenCVModal(true)}
                    className="text-blue-600 text-sm font-bold"
                  >
                    Ganti CV
                  </button>
                </div>
              ) : (
                <p className="text-red-600 text-sm">
                  Anda belum mengunggah CV
                </p>
              )}
            </div>

            {/* ACTION */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 rounded-xl py-3"
              >
                Batal
              </button>

              <button
                onClick={() => setShowApplyModal(true)}
                disabled={!cvUrl}
                className="flex-1 bg-emerald-600 text-white rounded-xl py-3"
              >
                Kirim Lamaran
              </button>
            </div>
          </div>
        )}

        {/* UPDATE CV MODAL */}
        <UpdateCV
          isOpen={openCVModal}
          onClose={() => setOpenCVModal(false)}
          onSuccess={(url) => {
            setCvUrl(url);
            setOpenCVModal(false);
          }}
        />

        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="absolute inset-0 bg-white rounded-3xl flex flex-col items-center justify-center text-center p-10">
            <TickCircle size={80} color="#43934B" variant="Bold" />
            <h2 className="mt-6 text-xl font-bold">
              Lamaran Berhasil Dikirim
            </h2>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-[#43934B] text-white rounded-xl"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyJobModal;
