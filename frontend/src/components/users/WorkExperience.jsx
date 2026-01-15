import { useEffect, useState } from "react";
import axios from "axios";

export default function WorkExperience() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const token = localStorage.getItem("accessToken");

  // =======================
  // GET WORK EXPERIENCE
  // =======================
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/work-experience",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =======================
  // HANDLE FORM
  // =======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =======================
  // SUBMIT
  // =======================
  const submit = async () => {
    if (
      !form.company_name ||
      !form.job_title ||
      !form.start_date
    ) {
      return alert("Perusahaan, jabatan, dan tahun mulai wajib diisi");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/user/work-experience",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        company_name: "",
        job_title: "",
        start_date: "",
        end_date: "",
        description: "",
      });

      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal menyimpan pengalaman kerja"
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // DELETE
  // =======================
  const remove = async (id) => {
    if (!window.confirm("Hapus pengalaman kerja ini?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/user/work-experience/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal menghapus data"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= LIST ================= */}
      {data.length > 0 && (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 space-y-1"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">
                    {item.job_title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.company_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.start_date} –{" "}
                    {item.end_date || "Sekarang"}
                  </p>
                </div>

                <button
                  onClick={() => remove(item._id)}
                  className="text-red-500 text-sm"
                >
                  Hapus
                </button>
              </div>

              {item.description && (
                <p className="text-sm text-gray-700">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= FORM ================= */}
      <div className="border rounded-xl p-5 space-y-3">
        <h3 className="font-medium text-sm">
          Tambah Pengalaman Kerja
        </h3>

        <input
          type="text"
          name="company_name"
          placeholder="Nama Perusahaan"
          value={form.company_name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="text"
          name="job_title"
          placeholder="Jabatan"
          value={form.job_title}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="start_date"
            placeholder="Tahun Mulai"
            value={form.start_date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="number"
            name="end_date"
            placeholder="Tahun Selesai"
            value={form.end_date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <textarea
          name="description"
          placeholder="Deskripsi pekerjaan (opsional)"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <div className="flex justify-end">
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
