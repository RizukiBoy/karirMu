import AdminLayout from "../components/layout/AdminAumLayout";

// ICONS
import docTextIcon from "../assets/icons/ProfilAum/document-text.svg";
import docDownloadIcon from "../assets/icons/ProfilAum/document-download.svg";
import whatsappIcon from "../assets/icons/ProfilAum/user.svg";
import linkIcon from "../assets/icons/ProfilAum/user.svg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


const gradientHeader = {
  background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
};

const ApplicationDetailClone = () => {
  const navigate = useNavigate();

  const [showReject, setShowReject] = useState(false);
  const [showAccept, setShowAccept] = useState(false);

  const applicantName = "Budi Santoso";

  const handleReject = () => {
    // TODO: API Tolak
    setShowReject(false);
    navigate("/admin-aum/manajemen-pelamar");
  };

  const handleAccept = () => {
    // TODO: API Lolos
    setShowAccept(false);
    navigate("/admin-aum/manajemen-pelamar");
  };
  return (
    <AdminLayout>

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

        <p className="font-medium text-gray-800">
          {applicantName}
        </p>

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
          className="
            flex-1
            border border-gray-300
            text-gray-600
            py-2.5
            rounded-lg
            text-sm
            font-medium
            hover:bg-gray-100
            transition
          "
        >
          Batal
        </button>

        <button
          onClick={handleReject}
          className="
            flex-1
            bg-red-600
            text-white
            py-2.5
            rounded-lg
            text-sm
            font-medium
            hover:bg-red-700
            transition
          "
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

        <p className="font-medium text-gray-800">
          {applicantName}
        </p>

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
          className="
            flex-1
            border border-green-600
            text-green-600
            py-2.5
            rounded-lg
            text-sm
            font-medium
            hover:bg-green-50
            transition
          "
        >
          Batal
        </button>

        <button
          onClick={handleAccept}
          className="
            flex-1
            bg-green-600
            text-white
            py-2.5
            rounded-lg
            text-sm
            font-medium
            hover:bg-green-700
            transition
          "
        >
          Lolos
        </button>
      </div>

    </div>
  </div>
)}



      <div className="space-y-4">

{/* ================= PROFIL PELAMAR ================= */}
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
      <p className="font-bold text-lg">Rafi Barrock</p>
      <p className="text-sm">
        Pengembang Software & Edukasi Digital
      </p>
    </div>
  </div>
</div>

{/* ================= DESKRIPSI ================= */}
<div className="bg-white rounded-lg shadow-sm p-4 text-sm space-y-2">
  <p className="font-semibold text-gray-700">Deskripsi</p>
  <p className="text-gray-600">
    "Deskripsi singkat pelamar..."
  </p>
</div>

{/* ================= BIODATA ================= */}
<div className="grid grid-cols-2 gap-4">

  {/* KIRI: DOMISILI & JENIS KELAMIN */}
  <div className="bg-white rounded-lg shadow-sm p-4 text-sm space-y-2">
    <p className="font-semibold text-gray-700">Biodata</p>

    <p>
      <span className="font-medium">Domisili</span> : Magelang
    </p>
    <p>
      <span className="font-medium">Jenis Kelamin</span> : Laki-laki
    </p>
  </div>

  {/* KANAN: NO TELP & USIA */}
  <div className="bg-white rounded-lg shadow-sm p-4 text-sm space-y-2">
    <p className="font-semibold text-gray-700">Kontak</p>

    <div className="flex items-center justify-between">
      <p>
        <span className="font-medium">No Telp</span> :
        <span className="ml-1">08239171016</span>
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
    src={whatsappIcon}
    alt="whatsapp"
    className="w-4 h-4"
  />
  WhatsApp
</button>

    </div>

    <p>
      <span className="font-medium">Usia</span> : 23 Tahun
    </p>
  </div>

</div>

{/* ================= PENDIDIKAN 1 ================= */}
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
    <p><span className="font-medium">Jenjang Studi</span> : Kuliah S1</p>
    <p><span className="font-medium">Jurusan</span> : Teknologi Informasi</p>
    <p><span className="font-medium">Nama Institusi</span> : Universitas Muhammadiyah Magelang</p>
    <p><span className="font-medium">Tahun</span> : 2020 – 2026</p>
  </div>
</div>


{/* ================= PENDIDIKAN 2 ================= */}
<div
  className="px-4 py-2.5 rounded-t-lg font-medium text-white"
  style={{
    background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
  }}
>
  Pendidikan 2
</div>

<div className="bg-white rounded-b-lg shadow-sm p-5 text-sm space-y-3 text-gray-700">
  <div className="grid grid-cols-1 gap-x-8 gap-y-3">
    <p><span className="font-medium">Jenjang Studi</span> : Kuliah S2</p>
    <p><span className="font-medium">Jurusan</span> : Teknologi Informasi</p>
    <p><span className="font-medium">Nama Institusi</span> : Universitas Muhammadiyah Magelang</p>
    <p><span className="font-medium">Tahun</span> : 2026 – 2030</p>
  </div>
</div>

{/* ================= PENGALAMAN & KEAHLIAN ================= */}
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
    <li>Backend Development</li>
    <li>REST API</li>
    <li>Database Management</li>
  </ul>
</div>


        {/* ================= DOKUMEN ================= */}
        <div className="px-4 py-2.5 rounded-t-lg font-medium text-white" style={gradientHeader}>
          Dokumen Pelamar
        </div>

        <div className="bg-white rounded-b-lg shadow-sm p-4 space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>CV / Resume</span>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 border border-green-600 text-green-600 rounded-md">
                <img src={docTextIcon} className="w-4" />
                Lihat File
              </button>
              <button className="flex items-center gap-1 px-3 py-1 border border-green-600 text-green-600 rounded-md">
                <img src={docDownloadIcon} className="w-4" />
                Unduh
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-blue-600">https://github.com/budi-dev</span>
            <button className="flex items-center gap-1 px-3 py-1 border border-green-600 text-green-600 rounded-md">
              <img src={linkIcon} className="w-4" />
              Buka Link
            </button>
          </div>
        </div>

        {/* ================= CATATAN ADMIN ================= */}
        <div className="px-4 py-2.5 rounded-t-lg font-medium text-white" style={gradientHeader}>
          Kirim Catatan
        </div>

<div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
  <textarea
    rows="4"
    maxLength={200}
    placeholder="Tuliskan pesan untuk Pelamar"
    className="
      w-full
      border border-gray-300
      rounded-md
      p-3
      text-sm
      focus:outline-none
      focus:ring-1
      focus:ring-green-500
    "
  />

  <p className="text-xs text-gray-400 text-right">0 / 200</p>
</div>



      </div>
    </AdminLayout>
  );
};

export default ApplicationDetailClone;

/* ========= REUSABLE SECTION ========= */
const Section = ({ title, children }) => (
  <>
    <div className="px-4 py-2.5 rounded-t-lg font-medium text-white" style={gradientHeader}>
      {title}
    </div>
    <div className="bg-white rounded-b-lg shadow-sm p-4 text-sm space-y-2">
      {children}
    </div>
  </>
);