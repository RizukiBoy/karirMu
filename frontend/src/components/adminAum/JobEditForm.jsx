import { useEffect, useState } from "react";

export default function JobEditForm({ job, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    job_name: job.job_name || "",
    job_field_id: job.job_field_id || "",
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
      const res = await fetch(
        `http://localhost:5000/api/admin-aum/jobs/${job._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(form),
        }
      );
      console.log(res);

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal update lowongan");
      }

      onSuccess({
        ...job,
        ...form,
      });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Edit Lowongan</h3>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <input
        name="job_name"
        value={form.job_name}
        onChange={handleChange}
        className="input input-bordered w-full"
        placeholder="Nama Pekerjaan"
        required
      />

      {/* JOB FIELD */}
      <select
        name="job_field_id"
        value={form.job_field_id}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="">Pilih Bidang Pekerjaan</option>
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

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        className="input input-bordered w-full"
        placeholder="Lokasi"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="">Pilih Tipe</option>
        <option value="full_time">Full Time</option>
        <option value="part_time">Part Time</option>
        <option value="internship">Internship</option>
        <option value="contract">Contract</option>
        <option value="freelance">Freelance</option>
      </select>

      <select
        name="work_type"
        value={form.work_type}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="">Pilih Work Type</option>
        <option value="onsite">Onsite</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name="salary_min"
          value={form.salary_min}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="Gaji Min"
        />
        <input
          type="number"
          name="salary_max"
          value={form.salary_max}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="Gaji Max"
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="textarea textarea-bordered w-full"
        placeholder="Deskripsi Pekerjaan"
      />

      <textarea
        name="requirement"
        value={form.requirement}
        onChange={handleChange}
        className="textarea textarea-bordered w-full"
        placeholder="Kualifikasi"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="status"
          checked={form.status}
          onChange={handleChange}
        />
        <span>Aktifkan Lowongan</span>
      </label>

      <div className="flex justify-end gap-2 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
        >
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
