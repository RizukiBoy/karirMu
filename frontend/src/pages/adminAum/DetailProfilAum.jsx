import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminAumLayout from "../../components/layout/AdminAumLayout";

// ICONS
import checkIcon from "../../assets/icons/ProfilAum/check.svg";
import userIcon from "../../assets/icons/ProfilAum/user.svg";
import docTextIcon from "../../assets/icons/ProfilAum/document-text.svg";
import closeIcon from "../../assets/icons/iconClose.svg";

const DetailProfilAum = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);

  // ===== EDIT STATE =====
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const openEditModal = () => {
  setFormData({
    company_name: company.company_name || "",
    company_phone: company.company_phone || "",
    company_email: company.company_email || "",
    company_url: company.company_url || "",
    province: company.province || "",
    city: company.city || "",
    industry: company.industry || "",
    employee_range: company.employee_range || "",
    description: company.description || "",
    address: company.address || "",
  });
  setPreviewLogo(company.logo_url || null);
  setShowEditModal(true);
};

  // ===== FETCH PROFILE =====
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin-aum/company/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (res.data.company) {
          setCompany(res.data.company);
          setDocuments(res.data.documents || []);
          setPreviewLogo(res.data.company.logo_url || null);
          console.log(res.data.documents)
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {

      const payload = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, value);
      }
    });

    // append logo jika ada
    if (logoFile) {
      payload.append("logo", logoFile);
    }
      await axios.put(
        "http://localhost:5000/api/admin-aum/company/edit-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // update UI tanpa reload
      setCompany((prev) => ({
        ...prev,
        ...formData,
        logo_url: previewLogo || prev.logo_url,
      }));

      setShowEditModal(false);
    } catch (err) {
      console.log(err.response);
      console.error("Gagal update profil:", err);
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!company) return null;

  return (
    <AdminAumLayout>
      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-[1124px] flex flex-col gap-4">

          {/* HEADER */}
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm font-semibold">
            Profil & Legalitas AUM
          </div>

          {/* ALERT */}
          {alertVisible && (
            <div className="relative bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex justify-between">
              <div className="flex gap-3">
                <img src={checkIcon} className="w-6 h-6 mt-1" />
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
                onClick={() => setAlertVisible(false)}
              />
            </div>
          )}

          {/* PROFIL HEADER */}
          <div
            className="flex rounded-t-2xl overflow-hidden shadow-sm"
            style={{
              background: "linear-gradient(90deg, #004F8F, #009B49)",
            }}
          >
            <div className="flex items-center p-4 flex-[0.65] text-white gap-4">
              <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <img src={userIcon} className="w-10 h-10" />
                )}
              </div>

              <div className="w-px h-20 bg-white/50"></div>

              <div>
                <p className="font-bold text-lg">{company.company_name}</p>
                <p className="text-sm opacity-90 line-clamp-2">{company.address}</p>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 flex-[0.35]">
              <div className="flex items-center gap-2 border border-white px-3 py-1.5 rounded text-white text-sm font-semibold">
                <img src={checkIcon} className="w-4 h-4 filter invert" />
                Terverifikasi
              </div>
            </div>
          </div>

          {/* INFORMASI */}
          <SectionHeader title="Informasi Umum" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Row label="Nama Perusahaan" value={company.company_name} />
              <Row label="No Telepon" value={company.company_phone} />
              <Row label="Provinsi" value={company.province} />
              <Row label="Bidang Industri" value={company.industry} />
            </Card>

            <Card>
              <Row label="Email" value={company.company_email} />
              <Row label="Website" value={company.company_url} />
              <Row label="Kota" value={company.city} />
              <Row label="Jumlah Karyawan" value={company.employee_range} />
            </Card>
          </div>

          <p className="font-medium text-gray-500">Deskripsi</p>
            <span className="text-black pt-2 flex text-wrap">
              {company.description}
            </span>

          {/* DOKUMEN */}
          <SectionHeader title="Dokumen Legalitas" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.length > 0 ? (
              documents.map((doc, i) => (
                <div
                key={i}
                className="bg-white rounded-md shadow-sm p-4"
                >
                  <div className="flex items-center gap-2 justify-between mb-4">
                    <span className="font-medium">{doc.document_name.replace(/_/g, " ")}</span>
                    <span className="text-sm text-white px-2 py-1 rounded bg-secondary">{doc.status}</span>
                  </div>

                  <div className="flex gap-2 items-center border border-secondary border-2 rounded w-fit px-3 py-1">
                    <img src={docTextIcon} className="w-6 h-6"/>
                  
                    <a
                      href={doc.document_url}
                      target="_blank"
                      className="text-secondary px-3 py-2 pt-2 rounded text-xs"
                    >
                      Lihat
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-2 text-gray-500">
                Belum ada dokumen
              </p>
            )}
          </div>



          {showEditModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-2xl max-h-[90vh]
                    rounded-xl shadow-lg grid grid-rows-[auto_1fr_auto]
                    overflow-hidden">

      {/* HEADER */}
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
        />
      </div>

      {/* BODY */}
      <div className="overflow-y-auto">

        {/* FOTO */}
        <div className="px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {previewLogo ? (
                <img src={previewLogo} className="w-full h-full object-cover" />
              ) : (
                <img src={userIcon} className="w-8 h-8 opacity-60" />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Foto Profil</p>
              <label className="inline-flex items-center gap-2
                                px-3 py-1.5 border border-gray-300 rounded
                                cursor-pointer text-sm hover:bg-gray-50">
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
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
              className="w-full border border-gray-300 rounded px-3 py-2 line-clamp-4"
            />

            
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-500 text-xs">Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-4">
        <div className="border-t border-gray-200/70 my-4"></div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#409144] text-white rounded
                       text-sm font-semibold hover:bg-[#367a3a]"
          >
            Simpan
          </button>
        </div>
      </div>

    </div>
  </div>
)}


          {/* EDIT BUTTON */}
          <div className="bg-white rounded-md p-4 flex justify-end shadow-sm">
            <button
              onClick={() => {
                setFormData(company);
                setShowEditModal(true);
                // disabled={loading}
              }}
              className="border border-[#409144] text-[#409144] px-5 py-2 rounded font-semibold
                         hover:bg-[#409144] hover:text-white transition"
            >
              Edit / Update
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL EDIT ================= */}
      {/* {showEditModal && (
        <EditModal
          formData={formData}
          previewLogo={previewLogo}
          onChange={handleChange}
          onLogoChange={handleLogoChange}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )} */}
    </AdminAumLayout>
  );
};

/* ================= COMPONENTS ================= */

const SectionHeader = ({ title }) => (
  <div
    className="px-4 py-3 rounded-t-md font-medium text-white"
    style={{ background: "linear-gradient(90deg, #004F8F, #009B49)" }}
  >
    {title}
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-md shadow-sm divide-y text-sm">
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between px-4 py-2">
    <span className="w-1/2 text-gray-500">{label}</span>
    <span className="w-1/2 font-medium line-clamp-1">{value}</span>
  </div>
);

/* ================= MODAL ================= */

const EditModal = ({
  formData,
  previewLogo,
  onChange,
  onLogoChange,
  onClose,
  onSave,
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-lg">
      <div
        className="px-5 py-3 text-white font-semibold flex justify-between"
        style={{ background: "linear-gradient(90deg,#004F8F,#009B49)" }}
      >
        Edit Profil
        <img src={closeIcon} className="w-4 h-4 cursor-pointer" onClick={onClose} />
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Input label="Nama Perusahaan" name="company_name" value={formData.company_name} onChange={onChange} />
        <Input label="No Telepon" name="company_phone" value={formData.company_phone} onChange={onChange} />
        <Input label="Email" name="company_email" value={formData.company_email} onChange={onChange} />
        <Input label="Website" name="company_url" value={formData.company_url} onChange={onChange} />
        <Input label="Provinsi" name="province" value={formData.province} onChange={onChange} />
        <Input label="Kota" name="city" value={formData.city} onChange={onChange} />
      </div>

      <div className="p-4 flex justify-end gap-3">
        <button onClick={onClose} className="border px-4 py-2 rounded">
          Batal
        </button>
        <button onClick={onSave} className="bg-[#409144] text-white px-4 py-2 rounded">
          Simpan
        </button>
      </div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      {...props}
      className="w-full border rounded px-3 py-2 text-sm"
    />
  </div>
);

export default DetailProfilAum;
