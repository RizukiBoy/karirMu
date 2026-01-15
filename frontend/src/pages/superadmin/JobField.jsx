import { useEffect, useState } from "react";
import axios from "axios";

export default function JobFields() {
  const [jobFields, setJobFields] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  // ======================
  // GET job fields
  // ======================
  const fetchJobFields = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/job-field");
      setJobFields(res.data.data);
    } catch (err) {
      setError("Gagal mengambil job fields");
    }
  };

  useEffect(() => {
    fetchJobFields();
  }, []);

  // ======================
  // CREATE job field
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama job field wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/job-field",
        { name },
        {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
      );

      setName("");
      fetchJobFields();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambahkan job field");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE job field
  // ======================
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus job field ini?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/job-fields/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchJobFields();
    } catch (err) {
      alert("Gagal menghapus job field");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Master Data Job Fields</h1>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Nama job field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white border rounded-lg divide-y">
        {jobFields.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">
            Belum ada job field
          </p>
        ) : (
          jobFields.map((item, index) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-4"
            >
              <span>
                {index + 1}. {item.name}
              </span>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
