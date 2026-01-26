import { useState, useEffect } from "react";
import axios from "axios";

export default function DocumentForm({ initialData, onSuccess }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [portofolioLink, setPortofolioLink] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================
  // Prefill (Edit)
  // ======================
  useEffect(() => {
    if (initialData) {
      setResumeUrl(initialData.resume_cv || "");
      setPortofolioLink(initialData.portofolio_link || "");
    }
  }, [initialData]);

  // ======================
  // Handlers
  // ======================
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumeUrl(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // CV optional
      if (resumeFile) {
        formData.append("resume_cv", resumeFile);
      }

      // Portofolio optional
      formData.append("portofolio_link", portofolioLink || "");

      await axios.post(
        "http://localhost:5000/api/user/document",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Dokumen berhasil disimpan");
      onSuccess?.();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan dokumen");
          console.log("STATUS:", error.response.status);
          console.log("DATA:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Dokumen Pendukung</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resume CV */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Resume / CV
          </label>

          {resumeUrl && !resumeFile && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm underline block mb-2"
            >
              Lihat CV saat ini
            </a>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <p className="text-xs text-gray-500 mt-1">
            Upload CV hanya jika ingin memperbarui
          </p>
        </div>

        {/* Portofolio */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Link Portofolio
          </label>
          <input
            type="url"
            value={portofolioLink}
            onChange={(e) => setPortofolioLink(e.target.value)}
            placeholder="https://github.com/username"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Simpan Dokumen"}
        </button>
      </form>
    </div>
  );
}
