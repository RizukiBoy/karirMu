import AdminAumLayout from "../../components/layout/AdminAumLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import searchIcon from "../../assets/icons/iconClose.svg";
import { useNavigate } from "react-router-dom";

const BuatLowongan = () => {
  const navigate = useNavigate();

  const [jobFields, setJobFields] = useState([]);

  const [bidang, setBidang] = useState("");
  const [jobName, setJobName] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [dateJob, setDateJob] = useState("");
  const [address, setAddress ] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchJobFields = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/job-field");
        setJobFields(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil job fields", err);
      }
    };

    fetchJobFields();
  }, []);

  const formatRupiah = (value) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSalaryMinChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    setSalaryMin(formatRupiah(raw));
  };

  const handleSalaryMaxChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    setSalaryMax(formatRupiah(raw));
  };

const validate = () => {
  const newErrors = {};

  if (!jobName.trim()) {
    newErrors.jobName = "Nama lowongan wajib diisi";
  }

  if (!dateJob) {
    newErrors.dateJob = "Tenggat waktu wajib diisi";
  } else {
    const selected = new Date(dateJob);
    selected.setHours(0,0,0,0);

    const today = new Date();
    today.setHours(0,0,0,0);

    if (selected < today) {
      newErrors.dateJob = "Tenggat tidak boleh kurang dari hari ini";
    }
  }

  if (salaryMin && salaryMax) {
    const min = Number(salaryMin.replace(/\./g,""));
    const max = Number(salaryMax.replace(/\./g,""));

    if (min > max) {
      newErrors.salaryMax = "Gaji maksimum harus ≥ gaji minimum";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const token = localStorage.getItem("accessToken")

  const handleSubmit = async () => {
    try {
      if(!validate()) return;

      const payload = {
        job_field_id: bidang,
        job_name: jobName,
        location,
        address,
        type: jobType,
        work_type :workType,
        salary_min: salaryMin ? Number(salaryMin.replace(/\./g, "")) : null,
        salary_max: salaryMax ? Number(salaryMax.replace(/\./g, "")) : null,
        description,
        requirement,
        date_job: dateJob,
      };

const res = await axios.post(
  "http://localhost:5000/api/admin-aum/jobs",
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log("Backend response:", res.data);
      setShowConfirm(false);
    } catch (err) {
      console.error("ERROR SUBMIT:", err);
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <AdminAumLayout>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-623px h-439px rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5">
              <h2 className="text-xl font-bold text-center">
                Konfirmasi Publikasi Lowongan
              </h2>
            </div>

            <div className="px-6">
              <hr className="border-gray-200" />
            </div>

            <div className="px-10 py-4 text-sm text-gray-700 space-y-8">
              <p>Apakah Anda yakin ingin menerbitkan lowongan ini sekarang?</p>

              <div className="mt-2 space-y-1 text-gray-600">
                <p>Ringkasan Lowongan:</p>
                <p>Judul : {jobName || "[Nama Judul dari Input]"}</p>
                <p>Tipe : {workType || "[Tipe Kerja yang Dipilih]"}</p>
                <p>Deadline : {dateJob || "[Tanggal Deadline yang Diatur]"}</p>
              </div>
            </div>

            <div className="px-8">
              <hr className="border-gray-200" />
            </div>


                    {errors.dateJob && (
                      <p className="text-sm text-red-600 mt-1 flex justify-center">
                        {errors.dateJob}
                      </p>
                    )}

            <div className="px-6 py-5 flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-green-600 text-green-600 py-2.5 rounded-lg font-semibold hover:bg-green-50"
              >
                Periksa Kembali
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700"
              >
                Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-1124px flex flex-col gap-4">
          <div className="bg-white px-4 py-3 rounded-md shadow-sm text-sm flex items-center gap-2">
            <span className="text-gray-500">Manajemen Lowongan</span>
            <span className="text-gray-400">›</span>
            <span className="font-semibold">Buat Lowongan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm">
                <Header title="1. Informasi pekerjaan" />
              </div>

              <div className="bg-white rounded-lg shadow-sm min-h-220px">
                <div className="p-4 space-y-5 text-sm">
                  <Input
                    label="Judul Lowongan"
                    placeholder="UI UX Designer"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                  />

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">
                      Bidang
                    </label>

                    <select
                      value={bidang}
                      onChange={(e) => setBidang(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-0 mb-4"
                    >
                      <option value="">Pilih bidang</option>
                      {jobFields.map((field) => (
                        <option key={field._id} value={field._id}>
                          {field.name}
                        </option>
                      ))}
                    </select>

                    <Input
                        label="Alamat Lengkap"
                        placeholder="Contoh: Jl. Ahmad Yani No. 12, Magelang"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm">
                <Header title="2. Rincian Pekerjaan" />
              </div>

              <div className="bg-white rounded-lg shadow-sm min-h-220px">
                <div className="p-4 space-y-6 text-sm">
                  <Input
                    label="Lokasi Kerja"
                    placeholder="Ketik lokasi..."
                    icon={<img src={searchIcon} alt="search" className="w-4 h-4" />}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">
                      Tipe Pekerjaan
                    </label>

                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-0"
                    >
                      <option value="">Pilih</option>
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">
                      Sistem Kerja
                    </label>

                    <select
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-0"
                    >
                      <option value="">Pilih</option>
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <Header title="3. Additional Settings" />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 space-y-4 text-sm">
              <Textarea
                label="Deskripsi Pekerjaan"
                placeholder="Deskripsi Pekerjaan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Textarea
                label="Kualifikasi / Persyaratan"
                placeholder="Deskripsi Persyaratan"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />

              <div>
                <label className="text-xs text-gray-600 mb-2 block">
                  Kisaran gaji & tenggat waktu
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Rp Min"
                    value={salaryMin}
                    onChange={handleSalaryMinChange}
                  />

                  <Input
                    placeholder="Rp Max"
                    value={salaryMax}
                    onChange={handleSalaryMaxChange}
                  />

                  <Input
                    type="date"
                    value={dateJob}
                    onChange={(e) => setDateJob(e.target.value)}
                    className={`
                      h-10
                      ${errors.dateJob ? "border-red-500 focus:ring-red-500" : ""}
                    `}
                    />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between">
            <button
              onClick={() => navigate("/admin-aum/list-lowongan")}
              className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
            >
              Batal
            </button>

            <button
              className="px-6 py-2 bg-green-600 text-white rounded"
              onClick={() => setShowConfirm(true)}
            >
              Terbitkan
            </button>
          </div>
        </div>
      </div>
    </AdminAumLayout>
  );
};

const Header = ({ title }) => (
  <div
    className="px-4 py-3 rounded-t-lg font-medium text-white text-sm"
    style={{
      background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
    }}
  >
    {title}
  </div>
);

const Input = ({ label, placeholder, type = "text", icon, className, value, onChange, props }) => (
  <div>
    {label && <label className="text-xs text-gray-600">{label}</label>}
    <div className="relative mt-1">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-0 box-border ${className || ""}`}
      />
      {icon && <span className="absolute right-3 top-2.5">{icon}</span>}
    </div>
  </div>
);

const Textarea = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-600">{label}</label>
    <textarea
      rows={4}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-0"
    />
    <p className="text-right text-[11px] text-gray-400">0/200</p>
  </div>
);

export default BuatLowongan;