import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "reviewed", label: "Reviewed" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default function ApplicationDetail() {
  const { applyId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     FETCH DETAIL
  ======================= */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin-aum/applications/${applyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const application = res.data;

        setData(res.data);
        setStatus(res.data.apply_status);
        setNotes(res.data.hrd_notes || "");

        if (application.apply_status === "submitted") {
        await axios.patch(
          `http://localhost:5000/api/admin-aum/applications/${applyId}`,
          { apply_status: "reviewed" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setStatus("reviewed");
        setData((prev) => ({
          ...prev,
          apply_status: "reviewed",
        }));
      }
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal mengambil data pelamar"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [applyId]);

  /* =======================
     UPDATE STATUS / NOTES
  ======================= */
  const updateApplication = async (payload) => {
    try {
      setUpdating(true);

      await axios.patch(
        `http://localhost:5000/api/admin-aum/applications/${applyId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setData((prev) => ({ ...prev, ...payload }));
      if (payload.apply_status) setStatus(payload.apply_status);
      if (payload.hrd_notes !== undefined) setNotes(payload.hrd_notes);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update lamaran");
    } finally {
      setUpdating(false);
    }
  };

  /* =======================
     UI STATES
  ======================= */
  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

  const { applicant, profile, job, apply_date, cv_url } = data;

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Detail Pelamar</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Kembali
        </button>
      </div>

      {/* JOB INFO */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-lg mb-2">Lowongan</h2>
        <p className="text-gray-800">{job?.job_name}</p>
        <p className="text-sm text-gray-500">
          Tanggal Melamar:{" "}
          {new Date(apply_date).toLocaleDateString("id-ID")}
        </p>

      </div>

      {/* APPLICANT */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-lg mb-4">Data Pelamar</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Nama" value={applicant?.full_name} />
          <Info label="Email" value={applicant?.email} />
          <Info label="WhatsApp" value={profile?.whatsapp || "-"} />
          <Info label="Gender" value={profile?.gender || "-"} />
          <Info label="Umur" value={profile?.age || "-"} />
          <Info label="Alamat" value={profile?.address || "-"} />
        </div>
      </div>

      {/* ABOUT */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-lg mb-2">Tentang Pelamar</h2>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {profile?.about_me || "Tidak ada deskripsi"}
        </p>
      </div>

      {/* NOTES */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-lg mb-2">Catatan HRD</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border rounded-lg p-3 text-sm"
          placeholder="Tulis catatan HRD..."
        />
      </div>

      {/* CV */}
      <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">Curriculum Vitae</h2>
          <p className="text-sm text-gray-500">File CV pelamar</p>
        </div>

        {cv_url ? (
          <a
            href={cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Download CV
          </a>
        ) : (
          <span className="text-gray-400 text-sm">
            CV tidak tersedia
          </span>
        )}
      </div>

      {/* ACTION */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() =>
            updateApplication({
              apply_status: "rejected",
              hrd_notes: notes,
            })
          }
          disabled={updating || status === "rejected"}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg disabled:opacity-50"
        >
          Tolak
        </button>

        <button
          onClick={() =>
            updateApplication({
              apply_status: "accepted",
              hrd_notes: notes,
            })
          }
          disabled={updating || status === "accepted"}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          Terima
        </button>
      </div>
    </div>
  );
}

/* =======================
   HELPER COMPONENT
======================= */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
