import { useEffect, useState } from "react";
import axios from "axios";

export default function Lowongan() {
  const [form, setForm] = useState({
    job_name: "",
    job_field_id: "",
    location: "",
    work_type: "",
    type: "",
    salary_min: "",
    salary_max: "",
    description: "",
    requirement: "",
    date_job: "",
    status: true,
  });

  const [jobFields, setJobFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =======================
  // Fetch Job Fields (Dropdown)
  // =======================
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      form.salary_min &&
      form.salary_max &&
      Number(form.salary_min) > Number(form.salary_max)
    ) {
      setError("Salary minimum tidak boleh lebih besar dari salary maximum");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      };

      await axios.post(
        "http://localhost:5000/api/admin-aum/jobs",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Lowongan berhasil dibuat");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal membuat lowongan");
    } finally {
      setLoading(false);
    }
  };

  const qualificationTemplate = `KUALIFIKASI / PERSYARATAN

1. Pendidikan minimal :
2. Pengalaman kerja :
3. Keterampilan wajib :
   - 
   - 
4. Kualifikasi tambahan (nilai plus) :
5. Sikap & etika kerja :
   - Jujur
   - Bertanggung jawab
   - Disiplin
6. Ketersediaan waktu :
7. Catatan tambahan :
`;

const generateTemplate = () => {
  setForm(prev => ({
    ...prev,
    requirement: qualificationTemplate
  }));
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Tambah Lowongan Pekerjaan
      </h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 p-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Utama */}
        <section className="bg-white p-5 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Informasi Lowongan</h2>

          <Input
            label="Nama Pekerjaan"
            name="job_name"
            value={form.job_name}
            onChange={handleChange}
            required
          />

          <Select
            label="Bidang Pekerjaan"
            name="job_field_id"
            value={form.job_field_id}
            onChange={handleChange}
            required
          >
            <option value="">Pilih bidang pekerjaan</option>
            {jobFields.map((field) => (
              <option key={field._id} value={field._id}>
                {field.name}
              </option>
            ))}
          </Select>

          <Input
            label="Lokasi"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </section>

        {/* Tipe & Sistem Kerja */}
        <section className="bg-white p-5 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tempat Kerja"
            name="work_type"
            value={form.work_type}
            onChange={handleChange}
            required
          >
            <option value="">Pilih</option>
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </Select>

          <Select
            label="Tipe Pekerjaan"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Pilih</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </Select>
        </section>

        {/* Gaji */}
        <section className="bg-white p-5 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Gaji Minimum"
            type="number"
            name="salary_min"
            value={form.salary_min}
            onChange={handleChange}
          />
          <Input
            label="Gaji Maksimum"
            type="number"
            name="salary_max"
            value={form.salary_max}
            onChange={handleChange}
          />
        </section>

        {/* Deskripsi */}
        <section className="bg-white p-5 rounded-lg shadow space-y-4">
          <Textarea
            label="Deskripsi Pekerjaan"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          {/* <Textarea
            label="Kualifikasi / Persyaratan"
            name="requirement"
            value={form.requirement}
            onChange={handleChange}
            required
          /> */}

          <div className="form-group">
  <label>Kualifikasi / Persyaratan</label>

  <button
    type="button"
    onClick={generateTemplate}
    style={{
      marginBottom: "8px",
      padding: "6px 12px",
      fontSize: "12px",
      cursor: "pointer"
    }}
  >
    Gunakan Template Kualifikasi
  </button>

  <Textarea
    name="requirement"
    value={form.requirement}
    onChange={handleChange}
    required
  />
</div>


          <Input
            label="Lowongan Aktif sampai"
            type="date"
            name="date_job"
            value={form.date_job}
            onChange={handleChange}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            Lowongan Aktif
          </label>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Lowongan"}
        </button>
      </form>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...props}
      className="border rounded-lg p-2"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <select
      {...props}
      className="border rounded-lg p-2"
    >
      {children}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="border rounded-lg p-2"
    />
  </div>
);
