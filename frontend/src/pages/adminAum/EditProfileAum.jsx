import React, { useEffect, useState } from "react";
import axios from "axios";
import closeIcon from "../../assets/icons/iconClose.svg";
import userIcon from "../../assets/icons/ProfilAum/user.svg";

const EditProfileAum = ({
  open,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [jobFields, setJobFields] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  /* ================= INIT FORM ================= */
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        company_name: initialData.company_name || "",
        company_phone: initialData.company_phone || "",
        company_email: initialData.company_email || "",
        company_url: initialData.company_url || "",
        province: initialData.province || "",
        city: initialData.city || "",
        industry: initialData.industry || "",
        employee_range: initialData.employee_range || "",
        description: initialData.description || "",
        address: initialData.address || "",
      });
      setPreviewLogo(initialData.logo_url || null);
      setLogoFile(null);
    }
  }, [open, initialData]);

  /* ================= FETCH JOB FIELD ================= */
  useEffect(() => {
    if (!open) return;

    const fetchJobFields = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/job-field/`);
        setJobFields(res.data.data || []);
      } catch (err) {
        console.error("Gagal fetch job field:", err);
      }
    };

    fetchJobFields();
  }, [open]);

  /* ================= FETCH PROVINCES ================= */
  useEffect(() => {
    if (!open) return;

    const fetchProvinces = async () => {
      try {
        const res = await axios.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
        setProvinces(res.data || []);
      } catch (err) {
        console.error("Gagal fetch provinsi:", err);
      }
    };

    fetchProvinces();
  }, [open]);

  /* ================= FETCH CITIES ================= */
  useEffect(() => {
    if (!formData.province) return;

    const province = provinces.find(p => p.name === formData.province);
    if (!province) return;

    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`
        );
        setCities(res.data || []);
      } catch (err) {
        console.error("Gagal fetch kota:", err);
      }
    };

    fetchCities();
  }, [formData.province, provinces]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) payload.append(k, v);
      });

      if (logoFile) payload.append("logo", logoFile);

      await axios.put(
        "http://localhost:5000/api/admin-aum/company/edit-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

    const updated = res.data?.data || {
      ...initialData,
      ...formData,
      logo_url: previewLogo || initialData.logo_url,
    };

    onSuccess(updated);
    onClose();

    } catch (err) {
      console.error("Gagal update profil:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
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
            onClick={onClose}
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
            <Input label="Nama Perusahaan" name="company_name" value={formData.company_name || ""} onChange={handleChange} />
            <Input label="No Telepon" name="company_phone" value={formData.company_phone || ""} onChange={handleChange} />
            <Input label="Email" name="company_email" value={formData.company_email || ""} onChange={handleChange} />
            <Input label="Website" name="company_url" value={formData.company_url || ""} onChange={handleChange} />

            <Select label="Provinsi" name="province" value={formData.province || ""} onChange={handleChange}>
              <option value="">Pilih Provinsi</option>
              {provinces.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Select>

            <Select label="Kota / Kabupaten" name="city" value={formData.city || ""} onChange={handleChange}>
              <option value="">Pilih Kota</option>
              {cities.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </Select>

            <Select label="Bidang Industri" name="industry" value={formData.industry || ""} onChange={handleChange}>
              <option value="">Pilih Industri</option>
              {jobFields.map(j => (
                <option key={j._id} value={j.name}>{j.name}</option>
              ))}
            </Select>

            <Input label="Jumlah Karyawan" name="employee_range" value={formData.employee_range || ""} onChange={handleChange} />

            <div className="md:col-span-2">
              <label className="text-gray-500 text-xs">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-500 text-xs">Alamat</label>
              <textarea
                name="address"
                value={formData.address || ""}
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded text-sm font-semibold transition
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#409144] text-white hover:bg-[#367a3a]"}
              `}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2 text-sm" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <select {...props} className="w-full border rounded px-3 py-2 text-sm">
      {children}
    </select>
  </div>
);

export default EditProfileAum;
