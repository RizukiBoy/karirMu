import { useEffect, useState } from "react";
import axios from "axios";
import { Save2 } from "iconsax-reactjs";

const SaveJobButton = ({ jobId, onChange }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  // 🔎 Cek status awal
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/saved-jobs/check/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsSaved(res.data.saved);
      } catch (err) {
        console.error("Gagal cek saved job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) checkStatus();
  }, [jobId]);

  const toggleSave = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      if (!isSaved) {
        // ➕ SAVE
        await axios.post(
          "http://localhost:5000/api/saved-jobs",
          { job_id: jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsSaved(true);
      } else {
        // ❌ UNSAVE
        await axios.delete(
          `http://localhost:5000/api/saved-jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsSaved(false);
      }

      if (onChange) onChange(jobId);
    } catch (err) {
      console.error("Gagal toggle save:", err);
    }
  };

  if (loading) {
    return (
      <Save2 size="20" color="#9ca3af" variant="Outline" />
    );
  }

  return (
    <button
      onClick={toggleSave}
      title={isSaved ? "Hapus dari simpanan" : "Simpan lowongan"}
      className="p-1"
    >
      <Save2
        size="20"
        variant={isSaved ? "Bold" : "Outline"}
        color={isSaved ? "#16a34a" : "#6b7280"}
      />
    </button>
  );
};

export default SaveJobButton;
