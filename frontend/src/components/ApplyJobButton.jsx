import { useState } from "react";
import axios from "axios";

const ApplyJobButton = ({ jobId }) => {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  const handleApply = async () => {
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    if (role !== "pelamar") {
      alert("Hanya pelamar yang dapat melamar pekerjaan");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {},
        {
           headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
      );

      setApplied(true);
      alert("Lamaran berhasil dikirim");
    } catch (error) {
      const message =
        error.response?.data?.message || "Gagal melamar pekerjaan";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading || applied}
      className={`flex-1 rounded-xl py-3 text-white transition
        ${
          applied
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }
      `}
    >
      {loading
        ? "Mengirim Lamaran..."
        : applied
        ? "Sudah Dilamar"
        : "Lamar Sekarang"}
    </button>
  );
};

export default ApplyJobButton;
