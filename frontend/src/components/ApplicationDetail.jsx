import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import userIcon from "../assets/icons/ProfilAum/user.svg";
import AdminAumLayout from "./layout/AdminAumLayout";

const gradientHeader = {
  background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
};


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
  const [showReject, setShowReject] = useState(false);
  const [showAccept, setShowAccept] = useState(false);

const handleReject = async () => {
  try {
    await updateApplication({
      apply_status: "rejected",
      hrd_notes: notes,
    });
    setShowReject(false);
  } catch (err) {
    console.error("Gagal menolak lamaran:", err);
  }
};

const handleAccept = async () => {
  try {
    await updateApplication({
      apply_status: "accepted",
      hrd_notes: notes,
    });
    setShowAccept(false);
  } catch (err) {
    console.error("Gagal menerima lamaran:", err);
  }
};

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
        console.log(res.data);

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

  const { applicant, profile, job, apply_date, cv_url, educations, skills, workExperience } = data;

  return (
    <AdminAumLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* PAGE TITLE */}
        <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm flex items-center gap-2">
              <span className="text-gray-500">Manajemen Pelamar</span>
              <span className="text-gray-400">›</span>
              <span className="font-semibold">Review Pelamar</span>
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

        {/* Profile */}
        <div
          className="flex rounded-t-2xl overflow-hidden shadow-sm"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          {/* BAGIAN KIRI */}
          <div className="flex items-center p-4 flex-[0.65] text-white gap-4">
            
            {/* FOTO PROFIL */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-6">
              <img
                src={userIcon}
                className="w-10 h-10"
                alt="user"
              />
            </div>
        
            {/* GARIS VERTIKAL */}
            <div className="w-px bg-white h-20 mr-6"></div>
        
            {/* NAMA & DESKRIPSI */}
            <div>
              <p className="font-bold text-lg">{applicant?.full_name}</p>
              <p className="text-sm">
                {profile?.headline}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-sm space-y-2">
          <p className="font-semibold text-gray-700">Deskripsi</p>
          <p className="text-gray-600">
            {profile?.about_me}
          </p>
        </div>
        
        {/* ================= BIODATA ================= */}
        <div className="grid grid-cols-2 gap-4">
        
          {/* KIRI: DOMISILI & JENIS KELAMIN */}
          <div className="bg-white rounded-lg shadow-sm p-4 text-sm space-y-2">
            <p className="font-semibold text-gray-700">Biodata</p>
        
            <p>
              <span className="font-medium">Domisili</span> : {profile?.address}
            </p>
            <p>
              <span className="font-medium">Jenis Kelamin</span> : {profile?.gender}
            </p>
          </div>
        
          {/* KANAN: NO TELP & USIA */}
          <div className="bg-white rounded-lg shadow-sm p-4 text-sm space-y-2">
            <p className="font-semibold text-gray-700">Kontak</p>
        
            <div className="flex items-center justify-between">
              <p>
                <span className="font-medium">No Telp</span> :
                <span className="ml-1">{profile?.whatsapp}</span>
              </p>
        
        <button
          className="
            flex items-center gap-2
            px-4 py-2
            text-sm
            text-green-600
            border border-green-600
            rounded-md
            bg-transparent
            hover:bg-green-600
            hover:text-white
            transition
          "
        >
          <img
            src={userIcon}
            alt="whatsapp"
            className="w-4 h-4"
          />
          WhatsApp
        </button>
        
            </div>
        
            <p>
              <span className="font-medium">Usia</span> : {profile?.age}
            </p>
          </div>
        </div>

        <div
    className="px-4 py-2.5 rounded-t-lg font-medium text-white"
    style={{
      background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
    }}
  >
    Pendidikan 1
        </div>

      <div className="bg-white rounded-b-lg shadow-sm p-5 text-sm space-y-3 text-gray-700">
        <div className="grid grid-cols-1 gap-x-8 gap-y-3">
          <p><span className="font-medium">Jenjang Studi</span> : {educations[0].study_level}</p>
          <p><span className="font-medium">Jurusan</span> : {educations[0].major}</p>
          <p><span className="font-medium">Nama Institusi</span> : {educations[0].institution}</p>
          <p><span className="font-medium">Lulus tahun </span> : {educations[0].graduate}</p>
        </div>
      </div>

      <div
        className="px-4 py-2.5 rounded-t-lg font-medium text-white"
        style={{
          background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
        }}
      >
        Pengalaman & Keahlian
      </div>

      <div className="bg-white rounded-b-lg shadow-sm p-5 text-sm text-gray-700">
        <ul className="list-disc list-inside space-y-2">
          <li>{skills[0].name_skill}</li>
        </ul>
      </div>

          <div className="px-4 py-2.5 rounded-t-lg font-medium text-white" style={gradientHeader}>
            Dokumen Pelamar
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
              className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Lihat
            </a>
          ) : (
            <span className="text-gray-400 text-sm">
              CV tidak tersedia
            </span>
          )}
        </div>

              {/* ABOUT */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-lg mb-2">Tentang Pelamar</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {profile?.about_me || "Tidak ada deskripsi"}
          </p>
        </div>

          <div className="px-4 py-2.5 rounded-t-lg font-medium text-white" style={gradientHeader}>
            Kirim Catatan
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

        <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
          {/* KIRI - BATAL */}
          <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:underline"
            >
              ← Kembali
          </button>
          {/* KANAN - TOLAK & LOLOS */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowReject(true)}
              disabled={updating || status === "rejected"}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg disabled:opacity-50"
            >
              Tolak
            </button>

            <button
              onClick={() => setShowAccept(true)}
              disabled={updating || status === "accepted"}
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              Terima
            </button>
</div>

        </div>
      </div>

      {showReject && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white w-623px rounded-xl shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-6">
        <h2 className="text-lg font-semibold text-center text-black-600">
          Konfirmasi Penolakan
        </h2>
      </div>

      <div className="px-8">
        <hr className="border-gray-200" />
      </div>

      {/* CONTENT */}
      <div className="px-10 py-6 text-sm text-gray-700 space-y-4 text-center">
        <p>
          Apakah Anda yakin ingin
          <span className="font-medium text-red-600"> menolak </span>
          lamaran dari
        </p>

        <p className="font-medium text-gray-800">{applicant?.full_name}</p>

        <p className="text-gray-500 text-xs">
          Pesan yang Anda tulis akan dikirimkan ke pelamar.
        </p>
      </div>

      <div className="px-8">
        <hr className="border-gray-200" />
      </div>

      {/* FOOTER */}
      <div className="px-8 py-6 flex gap-4">
        <button
          onClick={() => setShowReject(false)}
          className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          Batal
        </button>

        <button
          onClick={handleReject}
          disabled={updating}
          className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
        >
          Tolak
        </button>
      </div>
    </div>
  </div>
)}

{showAccept && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white w-623px rounded-xl shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-6">
        <h2 className="text-lg font-semibold text-center text-black-600">
          Konfirmasi Lolos
        </h2>
      </div>

      <div className="px-8">
        <hr className="border-gray-200" />
      </div>

      {/* CONTENT */}
      <div className="px-10 py-6 text-sm text-gray-700 space-y-4 text-center">
        <p>
          Apakah Anda yakin ingin
          <span className="font-medium text-green-600"> meloloskan </span>
          pelamar berikut?
        </p>

        <p className="font-medium text-gray-800">{applicantName}</p>

        <p className="text-gray-500 text-xs">
          Pesan yang Anda tulis akan dikirimkan ke pelamar.
        </p>
      </div>

      <div className="px-8">
        <hr className="border-gray-200" />
      </div>

      {/* FOOTER */}
      <div className="px-8 py-6 flex gap-4">
        <button
          onClick={() => setShowAccept(false)}
          className="flex-1 border border-green-600 text-green-600 py-2.5 rounded-lg text-sm font-medium hover:bg-green-50 transition"
        >
          Batal
        </button>

        <button
          onClick={handleAccept}
          disabled={updating}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          Lolos
        </button>
      </div>
    </div>
  </div>
)}
    </AdminAumLayout>
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


