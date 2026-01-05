import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminAumLayout from "../../components/layout/AdminAumLayout";

// ICONS
import checkIcon from "../../assets/icons/ProfilAum/check.svg";
import userIcon from "../../assets/icons/ProfilAum/user.svg";
import docTextIcon from "../../assets/icons/ProfilAum/document-text.svg";
import downloadIcon from "../../assets/icons/ProfilAum/document-download.svg";
import editIcon from "../../assets/icons/ProfilAum/edit.svg";
import closeIcon from "../../assets/icons/iconClose.svg";

const DetailProfilAum = () => {
  const navigate = useNavigate();
 const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin-aum/company/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        console.log("Backend response:", response.data); 

        if (response.data.company) {
          setCompany(response.data.company);
          setDocuments(response.data.data || []);
        } else {
          // Jika belum ada perusahaan, redirect ke ProfilAum untuk input
          // navigate("/admin-aum/profil");
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!company) return null; 

  return (
//     <AdminAumLayout>
//       <div className="w-full flex justify-center px-4 py-6">
//         <div className="w-full max-w-1124px flex flex-col gap-4">

//           {/* HEADER */}
//           <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm font-semibold">
//             Profil & Legalitas AUM
//           </div>

//           {/* ALERT */}
//           <div className="relative bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex justify-between">
//             <div className="flex gap-3">
//               <img src={checkIcon} className="w-6 h-6 mt-1" alt="check" />
//               <div>
//                 <p className="font-bold">Profil Anda Sudah Lengkap</p>
//                 <p className="text-sm text-gray-600">
//                   Anda dapat menggunakan seluruh fitur rekrutmen kami.
//                 </p>
//                 <button className="mt-3 px-4 py-1.5 border border-blue-600 text-blue-600 rounded text-sm font-semibold hover:bg-blue-50">
//                   Lihat Riwayat Verifikasi
//                 </button>
//               </div>
//             </div>
//             <img src={closeIcon} className="w-4 h-4 cursor-pointer" alt="close" />
//           </div>

//           {/* PROFIL AUM */}
//           <div className="bg-white p-4 rounded-md shadow-sm flex items-center gap-6">
//             <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
//               <img src={userIcon} className="w-6 h-6" alt="user" />
//             </div>

//             {/* GARIS VERTIKAL (SESUAI DASHBOARD) */}
//             <div className="h-10 w-px bg-gray-300"></div>

//             <div className="flex-1">
//               <p className="font-bold">PT. SURYA MEDIA UTAMA</p>
//               <p className="text-sm text-gray-600">
//                 Pengembang Software & Edukasi Digital
//               </p>
//             </div>

//             <div className="flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-1.5 rounded text-sm font-semibold">
//               <img src={checkIcon} className="w-4 h-4" alt="verified" />
//               Terverifikasi
//             </div>
//           </div>

//           {/* INFORMASI UMUM */}
//           <div className="bg-[#A2A9B0] text-black px-4 py-3 rounded-t-md font-medium">
//             Informasi Umum
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* CARD KIRI */}
//             <div className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm">
//               <Row label="Email Perusahaan" value="hrd@suryabadi.com" />
//               <Row label="No Telepon" value="0274 512345" />
//               <Row label="Website Resmi" value="https://suryabadi.co.id" />
//             </div>

//             {/* CARD KANAN */}
//             <div className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm">
//               <Row label="Email Perusahaan" value="hrd@suryabadi.com" />
//               <Row label="No Telepon" value="0274 512345" />
//               <Row label="Website Resmi" value="https://suryabadi.co.id" />
//             </div>
//           </div>

//           {/* DESKRIPSI & ALAMAT */}
//           <div className="bg-white rounded-md divide-y divide-gray-200 text-sm shadow-sm">
//             <div className="p-4">
//               <p className="text-gray-500 mb-1">Deskripsi Perusahaan</p>
//               <p>
//                 Perusahaan pengembang software untuk mendukung kemajuan Amal Usaha.
//               </p>
//             </div>
//             <div className="p-4">
//               <p className="text-gray-500 mb-1">Alamat Kantor Pusat</p>
//               <p>
//                 Jl. Kapas No. 9, Semaki, Kec. Umbulharjo, Kota Yogyakarta
//               </p>
//             </div>
//           </div>

//           {/* DOKUMEN LEGALITAS */}
//           <div className="bg-[#A2A9B0] text-black px-4 py-3 rounded-t-md font-medium">
//             Dokumen Legalitas
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* SK & NPWP */}
//             <div className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm">
//               <Row label="No. SK Pendirian" value="123/SK/PP/2024" />
//               <Row label="No. NPWP Instansi" value="00.000.000.0-000.000" />
//             </div>

//             {/* AD/ART & KAIDAH */}
//   {/* AD/ART & KAIDAH */}
// <div className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm">
//   {["Dokumen AD/ART", "Kaidah Pimpinan Pusat"].map((doc, i) => (
//     <div key={i} className="p-4 flex justify-between items-center">
      
//       {/* LABEL */}
//       <div className="flex items-center gap-2">
//         <img src={docTextIcon} className="w-4 h-4" alt="doc" />
//         <span className="font-medium">{doc}</span>
//       </div>

//       {/* ACTION */}
//       <div className="flex gap-2">
//         {/* LIHAT FILE */}
//         <button
//           type="button"
//           className="flex items-center gap-1 border border-blue-600 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50 transition"
//         >
//           <img src={docTextIcon} className="w-5 h-5" />
//           Lihat File
//         </button>

//         {/* UNDUH */}
//         <button
//           type="button"
//           className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
//         >
//           <img src={downloadIcon} className="w-4 h-4" />
//           Unduh
//         </button>
//       </div>

//     </div>
//   ))}
// </div>

//           </div>

//           {/* EDIT BUTTON */}
//           <div className="bg-white rounded-md p-4 flex justify-end shadow-sm">
//             <button
//               onClick={() => navigate("/admin-aum/profil/edit")}
//               className="flex items-center gap-2 border border-blue-600 text-blue-600 px-5 py-2 rounded font-semibold hover:bg-blue-600 hover:text-white transition"
//             >
//               <img src={editIcon} className="w-4 h-4" />
//               Edit / Update
//             </button>
//           </div>

//         </div>
//       </div>
//     </AdminAumLayout>

    <AdminAumLayout>
      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-1124px flex flex-col gap-4">

          {/* HEADER */}
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm font-semibold">
            Profil & Legalitas AUM
          </div>

          {/* ALERT */}
          <div className="relative bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex justify-between">
            <div className="flex gap-3">
              <img src={checkIcon} className="w-6 h-6 mt-1" alt="check" />
              <div>
                <p className="font-bold">Profil Anda Sudah Lengkap</p>
                <p className="text-sm text-gray-600">
                  Anda dapat menggunakan seluruh fitur rekrutmen kami.
                </p>
              </div>
            </div>
            <img src={closeIcon} className="w-4 h-4 cursor-pointer" alt="close" />
          </div>

          {/* PROFIL AUM */}
          <div className="bg-white p-4 rounded-md shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  className="w-full h-full object-cover rounded-full"
                  alt="Logo Perusahaan"
                />
              ) : (
                <img src={userIcon} className="w-6 h-6" alt="user" />
              )}
            </div>

            <div className="h-10 w-px bg-gray-300"></div>

            <div className="flex-1">
              <p className="font-bold">{company.company_name}</p>
              <p className="text-sm text-gray-600">{company.description}</p>
            </div>

            <div className="flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-1.5 rounded text-sm font-semibold">
              <img src={checkIcon} className="w-4 h-4" alt="verified" />
              Terverifikasi
            </div>
          </div>

          {/* INFORMASI UMUM */}
          <div className="bg-[#A2A9B0] text-black px-4 py-3 rounded-t-md font-medium">
            Informasi Umum
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD KIRI */}
            <div className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm">
              <Row label="Email Perusahaan" value={company.company_email} />
              <Row label="No Telepon" value={company.company_phone} />
              <Row label="Website Resmi" value={company.company_url} />
              <Row label="Industri" value={company.industry} />
              <Row label="Jumlah Karyawan" value={company.employee_range} />
            </div>

            {/* CARD KANAN */}
            <div className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm">
              <Row label="Provinsi" value={company.province} />
              <Row label="Kota / Kabupaten" value={company.city} />
              <Row label="Alamat" value={company.address} />
            </div>
          </div>

          {/* DESKRIPSI & ALAMAT */}
          <div className="bg-white rounded-md divide-y divide-gray-200 text-sm shadow-sm">
            <div className="p-4">
              <p className="text-gray-500 mb-1">Deskripsi Perusahaan</p>
              <p>{company.description}</p>
            </div>
          </div>

          {/* DOKUMEN LEGALITAS */}
          <div className="bg-[#A2A9B0] text-black px-4 py-3 rounded-t-md font-medium">
            Dokumen Legalitas
          </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {documents.length ? (
    documents.map((doc, i) => (
      <div
        key={i}
        className="bg-white rounded-b-md divide-y divide-gray-200 text-sm shadow-sm"
      >
        <div className="p-4 flex justify-between items-center">
          {/* Nama Dokumen */}
          <div className="flex items-center gap-2">
            <img src={docTextIcon} className="w-4 h-4" alt="doc" />
            <span className="font-medium">{doc.document_name}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Lihat File di browser */}
            <a
              href={doc.document_url} // langsung pakai Cloudinary URL
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 border border-blue-600 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50 transition"
            >
              <img src={docTextIcon} className="w-5 h-5" />
              Lihat File
            </a>

            {/* Unduh File sebagai PDF */}
            <a
              href={doc.document_url} // langsung pakai Cloudinary URL
              download={`${doc.document_name}.pdf`} // nama file saat diunduh
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
            >
              <img src={downloadIcon} className="w-4 h-4" />
              Unduh
            </a>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center py-4 col-span-2 text-gray-500">
      Belum ada dokumen yang diunggah
    </p>
  )}
</div>

          {/* EDIT BUTTON */}
          <div className="bg-white rounded-md p-4 flex justify-end shadow-sm">
            <button
              onClick={() => navigate("/admin-aum/profil/edit")}
              className="flex items-center gap-2 border border-blue-600 text-blue-600 px-5 py-2 rounded font-semibold hover:bg-blue-600 hover:text-white transition"
            >
              <img src={editIcon} className="w-4 h-4" />
              Edit / Update
            </button>
          </div>
        </div>
      </div>
    </AdminAumLayout>
  );
};

/* ROW STYLE (GARIS DALAM CARD) */
const Row = ({ label, value }) => (
  <div className="flex px-4 py-3">
    <span className="w-56 text-gray-500">{label}</span>
    <span className="font-medium break-all">{value}</span>
  </div>
);


export default DetailProfilAum;
