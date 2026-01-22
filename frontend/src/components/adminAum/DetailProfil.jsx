import React, {useState, useEffect} from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import AdminAumLayout from "../../components/layout/AdminAumLayout";

// ICONS
import checkIcon from "../../assets/icons/ProfilAum/check.svg";
import userIcon from "../../assets/icons/ProfilAum/user.svg";
import docTextIcon from "../../assets/icons/ProfilAum/document-text.svg";
import downloadIcon from "../../assets/icons/ProfilAum/document-download.svg";
import closeIcon from "../../assets/icons/iconClose.svg";

const DetailProfilAum = () => {
  const navigate = useNavigate();
 const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewLogo, setPreviewLogo] = useState(company?.logo_url || null);

const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPreviewLogo(URL.createObjectURL(file));
  }
};


  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSave = async () => {
  try {
    const res = await axios.put(
      "http://localhost:5000/api/admin-aum/company/profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    // update tampilan tanpa reload
    setCompany((prev) => ({
      ...prev,
      ...formData,
      logo_url: previewLogo || prev.logo_url,
    }));

    setShowEditModal(false);
  } catch (error) {
    console.error("Gagal update profil:", error);
  }
};


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

      console.log(response.data);
      console.log(documents);
      
       if (company?.logo_url) {
    setPreviewLogo(company.logo_url);
  }

        if (response.data) {
          setCompany(response.data.company);
          setDocuments(response.data.documents || []);

        }
      else {
        // Redirect jika belum ada perusahaan
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

    <AdminAumLayout>
      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-1124px flex flex-col gap-4">

          {/* HEADER */}
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm font-semibold">
            Profil & Legalitas AUM
          </div>
          
{showEditModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
    
    {/* MODAL */}
    <div className="
      bg-white w-full max-w-2xl
      max-h-[90vh]
      rounded-xl shadow-lg
      grid grid-rows-[auto_1fr_auto]
      overflow-hidden
    ">

      {/* ================= HEADER ================= */}
      <div
        className="px-5 py-3 text-white font-semibold
                   flex justify-between items-center"
        style={{ background: "linear-gradient(90deg, #004F8F, #009B49)" }}
      >
        Edit Profile
        <img
          src={closeIcon}
          className="w-4 h-4 cursor-pointer filter invert"
          onClick={() => setShowEditModal(false)}
          alt="close"
        />
      </div>

      {/* ================= BODY (SCROLLABLE) ================= */}
      <div className="overflow-y-auto">

        {/* FOTO PROFIL */}
        <div className="px-6 pt-6">
          <div className="flex items-center gap-4">
            
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              ) : (
                <img src={userIcon} className="w-8 h-8 opacity-60" />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Foto Profil</p>
              <label className="
                inline-flex items-center gap-2
                px-3 py-1.5 border border-gray-300 rounded
                cursor-pointer text-sm hover:bg-gray-50 transition
              ">
                Edit Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gray-400 mt-1">
                PNG / JPG · max 2MB
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-2xl">
          <Input label="Nama Perusahaan" name="company_name" value={formData.company_name} onChange={handleChange} />
          <Input label="No Telepon" name="company_phone" value={formData.company_phone} onChange={handleChange} />
          <Input label="Email" name="company_email" value={formData.company_email} onChange={handleChange} />
          <Input label="Website" name="company_url" value={formData.company_url} onChange={handleChange} />
          <Input label="Provinsi" name="province" value={formData.province} onChange={handleChange} />
          <Input label="Kota / Kabupaten" name="city" value={formData.city} onChange={handleChange} />
          <Input label="Bidang Industri" name="industry" value={formData.industry} onChange={handleChange} />
          <Input label="Jumlah Karyawan" name="employee_range" value={formData.employee_range} onChange={handleChange} />

          <div className="md:col-span-2">
            <label className="text-gray-500 text-xs">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2
                         focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-500 text-xs">Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2
                         focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="px-6 pb-4 bg-white">
        <div className="border-t border-gray-200/70 my-4"></div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border border-gray-300 rounded text-sm
                       hover:bg-gray-50 transition"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#409144] text-white rounded
                       text-sm font-semibold hover:bg-[#367a3a] transition"
          >
            Simpan
          </button>
        </div>
      </div>

    </div>
  </div>
)}



{alertVisible && (
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
    <img
      src={closeIcon}
      className="w-4 h-4 cursor-pointer"
      alt="close"
      onClick={() => setAlertVisible(false)}
    />
  </div>
)}


{/* PROFIL AUM */}
<div
  className="flex  rounded-t-2xl overflow-hidden shadow-sm"
  style={{
    background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
  }}
>
  {/* BAGIAN KIRI: PROFIL */}
  <div className="flex items-center p-4 flex-[0.6] text-white gap-4">
    {/* Logo */}
    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-6">
      {company.logo_url ? (
        <img
          src={company.logo_url}
          className="w-full h-full object-cover rounded-full"
          alt="Logo Perusahaan"
        />
      ) : (
        <img src={userIcon} className="w-10 h-10" alt="user" />
      )}
    </div>

    {/* GARIS VERTIKAL SEBELAH KANAN LOGO */}
    <div className="w-px bg-white h-20 mr-6"></div>

    {/* NAMA & DESKRIPSI */}
    <div>
      <p className="font-bold text-lg">{company.company_name}</p>
      <p className="text-sm">{company.description}</p>
    </div>
  </div>

  {/* BAGIAN KANAN: STATUS TERVERIFIKASI */}
  <div className="flex items-center justify-end p-4 flex-[0.4]">
    <div className="flex items-center gap-2 border border-white px-3 py-1.5 rounded text-white text-sm font-semibold">
      {/* ICON CEKLIS PUTIH */}
      <img src={checkIcon} className="w-4 h-4 filter brightness-0 invert" alt="verified" />
      Terverifikasi
    </div>
  </div>
</div>

          {/* INFORMASI UMUM */}
<div
  className="px-4 py-3 rounded-t-md font-medium text-white"
  style={{
    background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
  }}
>
  Informasi Umum
</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* CARD KIRI */}
  <div className="bg-white rounded-md shadow-sm divide-y divide-gray-200 text-sm">
    <Row label="Nama Perusahaan" value={company.company_name} />
    <Row label="No Telepon" value={company.company_phone} />
    <Row label="Provinsi" value={company.province} />
    <Row label="Bidang Industri" value={company.industry} />
  </div>

  {/* CARD KANAN */}
  <div className="bg-white rounded-md shadow-sm divide-y divide-gray-200 text-sm">
    <Row label="Email Perusahaan" value={company.company_email} />
    <Row label="Website Resmi" value={company.company_url} />
    <Row label="Kota / Kabupaten" value={company.city} />
    <Row label="Jumlah Karyawan" value={company.employee_range} />
  </div>
</div>

{/* DESKRIPSI & ALAMAT */}
<div className="bg-white rounded-md shadow-sm divide-y divide-gray-200 text-sm mt-4">
  <div className="p-4">
    <p className="text-gray-500 mb-1 font-semibold">Deskripsi Perusahaan</p>
    <p>{company.description}</p>
  </div>
  <div className="p-4">
    <p className="text-gray-500 mb-1 font-semibold">Alamat Lengkap</p>
    <p>{company.address}, {company.city}, {company.province}</p>
  </div>
</div>

{/* DOKUMEN LEGALITAS */}
<div
  className="px-4 py-3 rounded-t-md font-medium text-white"
  style={{
    background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
  }}
>
  Dokumen Legalitas
</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {Array.isArray(documents) && documents.length > 0 ? (
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

            <div className="flex items-center gap-3">
  {/* ===== BADGE STATUS ===== */}
  {doc.dcoument.status === "approved" && (
    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded">
      Approved
    </span>
  )}

  {doc.status === "rejected" && (
    <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded">
      Rejected
    </span>
  )}

  {(!doc.status || doc.status === "pending") && (
    <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded">
      Pending
    </span>
  )}

  {/* ===== ACTION BUTTONS (SUPER ADMIN ONLY) ===== */}
  {doc.status === "pending" && (
    <>
      <button
        onClick={() => verifyDocument(doc._id, "approved")}
        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        Approve
      </button>

      <button
        onClick={() => verifyDocument(doc._id, "rejected")}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reject
      </button>
    </>
  )}
            </div>


          {/* EDIT BUTTON */}
          <div className="bg-white rounded-md p-4 flex justify-end shadow-sm">
<button
  onClick={() => {
    setFormData({
      company_name: company.company_name,
      company_phone: company.company_phone,
      company_email: company.company_email,
      company_url: company.company_url,
      province: company.province,
      city: company.city,
      industry: company.industry,
      employee_range: company.employee_range,
      description: company.description,
      address: company.address,
    });
    setShowEditModal(true);
  }}
  className="flex items-center gap-2 border border-[#409144] text-[#409144] px-5 py-2 rounded font-semibold hover:bg-[#409144] hover:text-white transition"
>
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
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-gray-500 text-xs">{label}</label>
    <input
    id={name}
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="
          w-full
          rounded
          px-3
          py-2
          text-sm
          border
          border-gray-300
          focus:outline-none
          focus:border-gray-400
          focus:ring-1
          focus:ring-gray-400
        "
    />
  </div>
);


export default DetailProfilAum;
