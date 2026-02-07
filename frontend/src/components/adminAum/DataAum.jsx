import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "../../assets/icons/ProfilAum/user.svg";
import axios from 'axios';

/* ================= Reusable Components ================= */
const Input = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="w-full">
    <label className="text-[13px] font-medium text-gray-700">{label}</label>
    <div className="flex items-center h-10.5 bg-[#F2F4F8] rounded-sm px-4 mt-1">
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-transparent text-sm outline-none"
      />
    </div>
  </div>
);

const Select = ({ label, placeholder, options = [], value, onChange, disabled }) => (
  <div className="w-full">
    <label className="text-[13px] font-medium text-gray-700">{label}</label>
    <div className="flex items-center h-10.5 bg-[#F2F4F8] rounded-sm px-4 mt-1">
      <select
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-transparent text-sm outline-none"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);

const Textarea = ({ label, placeholder, value, onChange }) => (
  <div className="w-full">
    <label className="text-[13px] font-medium text-gray-700">{label}</label>
    <textarea
      rows={4}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      className="mt-1 w-full bg-[#F2F4F8] px-4 py-3 rounded-sm text-sm resize-none outline-none"
    />
  </div>
);

/* ================= Main Component ================= */
const DataAum = ({ formData = {}, setFormData, submitHandler, agree, setAgree }) => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // State untuk API Wilayah
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCity, setLoadingCity] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [loadingIndustry, setLoadingIndustry] = useState(true);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/industries");
        setIndustries(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil industry", err);
      } finally {
        setLoadingIndustry(false);
      }
    };

    fetchIndustries();
  }, []);


  // 1. Fetch Daftar Provinsi saat Mount
  useEffect(() => {
    fetch("https://rizukiboy.github.io/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({ label: item.name, value: item.name, id: item.id }));
        setProvinces(formatted);
      })
      .catch((err) => console.error("Gagal load provinsi:", err));
  }, []);

  // 2. Fetch Daftar Kota saat Provinsi Berubah
  useEffect(() => {
    if (!formData.province) {
      setCities([]);
      return;
    }

    // Cari ID provinsi berdasarkan nama (karena formData menyimpan Nama)
    const selectedProv = provinces.find((p) => p.value === formData.province);
    console.log(selectedProv)
    if (selectedProv) {
      setLoadingCity(true);
      fetch(`https://rizukiboy.github.io/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((item) => ({ label: item.name, value: item.name }));
          setCities(formatted);
          setLoadingCity(false);
        })
        .catch((err) => {
          console.error("Gagal load kota:", err);
          setLoadingCity(false);
        });
    }
  }, [formData.province, provinces]);

  // Logic Preview Foto
  useEffect(() => {
    if (!formData.logo) {
      setLogoPreview(null);
      return;
    }
    if (formData.logo instanceof File) {
      const objectUrl = URL.createObjectURL(formData.logo);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof formData.logo === "string") {
      setLogoPreview(formData.logo);
    }
  }, [formData.logo]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onInternalSubmit = () => {
    const data = new FormData();
    data.append("company_name", formData.company_name || "");
    data.append("company_email", formData.company_email || "");
    data.append("company_phone", formData.company_phone || "");
    data.append("company_url", formData.company_url || "");
    data.append("description", formData.description || "");
    data.append("address", formData.address || "");
    data.append("industry_id", formData.industry_id || "");
    data.append("employee_range", formData.employee_range || "");

    // Backend Anda minta JSON string
data.append("province", formData.province || "");
data.append("city", formData.city || "");


if (formData.logo instanceof File) {
  data.append("logo", formData.logo);
}

    // Logic dokumen (sesuaikan jika ada input file tambahan)
    const names = [];
    if (formData.documents) {
      formData.documents.forEach((doc) => {
        data.append("documents", doc.file);
        names.push(doc.name);
      });
    }
    data.append("document_names", JSON.stringify(names));

    submitHandler(data)
    .then((res) => {
      // Jika sukses, redirect ke DetailProfilAum
      navigate("/admin-aum/detail", { state: { formData } }); 
      // `state` bisa dipakai di DetailProfilAum untuk menampilkan data baru
    })
    .catch((err) => {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan data. Cek console untuk detail.");
    });
  };

  return (
    <>
      <div className="text-black font-medium bg-[#A2A9B0] px-4 py-3 rounded-t-lg mb-4">
        Informasi Umum
      </div>

      <div className="bg-white rounded-b-lg p-8 flex flex-col gap-8 shadow-sm mb">
        {/* LOGO SECTION */}
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-[#F2F4F8] flex items-center justify-center overflow-hidden border">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <img src={userIcon} alt="Default" className="w-12 h-12 opacity-30" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="border border-blue-600 text-blue-600 px-5 py-2 text-sm rounded hover:bg-blue-50 transition-colors"
            >
              Upload Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} />
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Nama Perusahaan" placeholder="PT Contoh" value={formData.company_name} onChange={(e) => handleChange("company_name", e.target.value)} />
          <Input label="Email Perusahaan" placeholder="hrd@company.com" value={formData.company_email} onChange={(e) => handleChange("company_email", e.target.value)} />
          <Input label="Nomor Telepon" placeholder="+62" value={formData.company_phone} onChange={(e) => handleChange("company_phone", e.target.value)} />
          <Input label="Website" placeholder="https://company.com" value={formData.company_url} onChange={(e) => handleChange("company_url", e.target.value)} />

          <Select
            label="Provinsi"
            placeholder="Pilih provinsi"
            options={provinces}
            value={formData.province}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, province: e.target.value, city: "" }));
            }}
          />

          <Select
            label="Kota / Kabupaten"
            placeholder={loadingCity ? "Loading..." : formData.province ? "Pilih kota" : "Pilih provinsi dahulu"}
            options={cities}
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={!formData.province || loadingCity}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Industri <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.industry_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  industry_id: e.target.value,
                })
              }
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loadingIndustry}
            >
              <option value="">
                {loadingIndustry ? "Memuat industri..." : "Pilih Bidang Industri"}
              </option>

              {industries.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <Select
            label="Jumlah Karyawan"
            placeholder="Pilih jumlah"
            options={[
              { label: "1 - 10", value: "1" },
              { label: "11 - 50", value: "11" },
              { label: "51 - 200", value: "51" },
              { label: "200+", value: "201" },
            ]}
            value={formData.employee_range}
            onChange={(e) => handleChange("employee_range", e.target.value)}
          />
        </div>

        <Textarea label="Deskripsi" placeholder="Profil singkat..." value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
        <Textarea label="Alamat Lengkap" placeholder="Alamat lengkap..." value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />

        <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer pt-2">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600" />
          <span>Saya menyatakan bahwa seluruh dokumen yang diunggah adalah benar dan valid.</span>
        </label>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onInternalSubmit}
            disabled={!agree}
            className={`px-8 py-2.5 rounded text-sm font-semibold transition-all ${
              agree ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Simpan Dokumen
          </button>
        </div>
      </div>
    </>
  );
};

export default DataAum;