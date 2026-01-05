import { useState } from "react";
import axios from "axios";

export default function Lowongan() {
  const [form, setForm] = useState({
    job_name: "",
    category: "",
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validasi client-side ringan
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

      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      };

      const res = await axios.post(
        "http://localhost:5000/api/admin-aum/jobs",
        payload,
        {
          headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Lowongan berhasil dibuat");
      console.log(res.data);

      // optional reset form
      // setForm(initialState);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal membuat lowongan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Tambah Lowongan Pekerjaan</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 p-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="job_name"
          placeholder="Job Name"
          value={form.job_name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="work_type"
            value={form.work_type}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
  <option value="">Pilih tempat kerja</option>
  <option value="onsite">Bekerja di Kantor</option>
  <option value="remote">Dimana Saja</option>
  <option value="hybrid">Hybrid</option>
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
  <option value="">Pilih tipe pekerjaan</option>
  <option value="full_time">Penuh Waktu</option>
  <option value="part_time">Paruh Waktu</option>
  <option value="internship">Magang</option>
  <option value="contract">Kontrak</option>
  <option value="freelance">Freelance</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            name="salary_min"
            placeholder="Salary Min"
            value={form.salary_min}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            step="0.01"
            name="salary_max"
            placeholder="Salary Max"
            value={form.salary_max}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          rows={4}
          required
        />

        <textarea
          name="requirement"
          placeholder="Requirement"
          value={form.requirement}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          rows={4}
          required
        />

        <input
          type="date"
          name="date_job"
          value={form.date_job}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
          />
          Lowongan Aktif
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Lowongan"}
        </button>
      </form>
    </div>
  );
}
