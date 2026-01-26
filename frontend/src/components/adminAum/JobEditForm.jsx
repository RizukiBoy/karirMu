import { useEffect, useState } from "react";
import axios from "axios";
export default function JobEditForm({ job, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    job_name: job.job_name || "",
    job_field_id: job.job_field?._id || job.job_field_id || "",
    location: job.location || "",
    type: job.type || "",
    work_type: job.work_type || "",
    salary_min: job.salary_min || "",
    salary_max: job.salary_max || "",
    description: job.description || "",
    requirement: job.requirement || "",
    status: job.status ?? true,
  });

  const [jobFields, setJobFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     Fetch job fields
  ======================= */
  useEffect(() => {
    const fetchJobFields = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/job-field"
        );
        const data = await res.json();
        console.log(res)
        setJobFields(data.data || []);
      } catch (err) {
        console.error("Gagal fetch job fields", err);
      }
    };

    fetchJobFields();
  }, []);

  /* =======================
     Handlers
  ======================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
      try {
    const res = await axios.put(
      `http://localhost:5000/api/admin-aum/jobs/${job._id}`,
      form,
      {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
      
    const selectedField = jobFields.find(
      (f) => f._id === form.job_field_id
    );

    onSuccess({
      ...job,
      ...res.data.data,

       job_field: selectedField
        ? { _id: selectedField._id, name: selectedField.name }
        : job.job_field,
      }); // update parent state
    onCancel();
  } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */
return (
  <form onSubmit={handleSubmit} className="space-y-6 text-sm">

    {/* INFO DASAR */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Judul Lowongan"
        name="job_name"
        value={form.job_name}
        onChange={handleChange}
      />

      <Select
        label="Tipe Kerja"
        name="type"
        value={form.type}
        onChange={handleChange}
        options={[
          { value: "full_time", label: "Full Time" },
          { value: "part_time", label: "Part Time" },
          { value: "internship", label: "Internship" },
          { value: "contract", label: "Contract" },
          { value: "freelance", label: "Freelance" },
        ]}
      />

      <Input
        label="Lokasi"
        name="location"
        value={form.location}
        onChange={handleChange}
      />

      <Select
        label="Tipe Pekerjaan"
        name="work_type"
        value={form.work_type}
        onChange={handleChange}
        options={[
          { value: "onsite", label: "Onsite" },
          { value: "remote", label: "Remote" },
          { value: "hybrid", label: "Hybrid" },
        ]}
      />

      <Input
        label="Gaji Minimum"
        name="salary_min"
        type="number"
        value={form.salary_min}
        onChange={handleChange}
      />

      <Input
        label="Gaji Maksimum"
        name="salary_max"
        type="number"
        value={form.salary_max}
        onChange={handleChange}
      />

      <Input
        label="Tenggat Waktu"
        name="date_job"
        type="date"
        value={form.date_job || ""}
        onChange={handleChange}
      />
    </div>

    {/* DESKRIPSI */}
    <div>
      <label className="text-gray-500 text-xs">Deskripsi</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
    </div>

    {/* PERSYARATAN */}
    <div>
      <label className="text-gray-500 text-xs mb-1 block">Persyaratan</label>
      <textarea
        name="requirement"
        value={form.requirement}
        onChange={handleChange}
        rows={6}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder="Tuliskan persyaratan, pisahkan baris jika perlu"
      />
    </div>

    {/* BIDANG PEKERJAAN */}
    <div>
      <label className="text-gray-500 text-xs">Bidang Pekerjaan</label>
      <select
        name="job_field_id"
        value={form.job_field_id}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
      >
        <option value="">Pilih Bidang</option>
        {jobFields.length > 0 ? (
          jobFields.map((field) => (
            <option key={field._id} value={field._id}>
              {field.name}
            </option>
          ))
        ) : (
          <option disabled>Memuat bidang pekerjaan...</option>
        )}
      </select>
    </div>

    {/* STATUS */}
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name="status"
        checked={form.status}
        onChange={handleChange}
      />
      <span>Aktifkan Lowongan</span>
    </label>

    {/* ACTION */}
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}

    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
      >
        Batal
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[#409144] text-white rounded text-sm font-semibold hover:bg-[#367a3a] transition disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  </form>

  );
}

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-xs">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-xs">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
    >
      <option value="">Pilih</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
