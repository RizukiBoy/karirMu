import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { DocumentUpload } from "iconsax-reactjs";

const UpdateCV = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);


  if (!isOpen) return null;

const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔒 CEGAH SUBMIT BERKALI-KALI
  if (isSubmittingRef.current || loading) return;

  if (!file) {
    setError("Silakan pilih file CV terlebih dahulu");
    return;
  }

  try {
    isSubmittingRef.current = true;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume_cv", file);

    const res = await axios.post(
      "http://localhost:5000/api/user/document",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    // ✅ KIRIM URL CV KE PARENT
    onSuccess?.(res.data.data?.resume_cv || res.data.resume_cv);

    onClose();
  } catch (err) {
    setError(err.response?.data?.message || "Gagal upload CV");
  } finally {
    setLoading(false);
    isSubmittingRef.current = false;
  }
};


  return (
    <>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b text-center">
          <h2 className="text-2xl font-black text-gray-900">
            Upload CV Terbaru
          </h2>
        </div>

        {/* BODY */}
        <div className="p-10 space-y-6 flex flex-col items-center">
          <label className="w-full border-2 border-dashed border-blue-400 rounded-3xl p-12 bg-blue-50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition">
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <DocumentUpload size={64} color="#2563eb" variant="Bold" />

            <p className="mt-4 font-bold text-blue-600 text-center">
              {file ? file.name : "Klik untuk upload CV Mu"}
            </p>
          </label>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <p className="text-xs text-gray-400 italic text-center">
            Maksimal ukuran dokumen 5 MB dalam format PDF
          </p>
        </div>

        {/* FOOTER */}
        <div className="p-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 font-bold rounded-xl"
          >
            Batal
          </button>

        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="flex-1 py-3 bg-[#43934B] text-white font-bold rounded-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Mengunggah..." : "Kirim"}
        </button>

        </div>
      </div>
    </div>
    </>

  );
};



export default UpdateCV;
