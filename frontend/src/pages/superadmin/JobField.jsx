import { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

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
<SuperAdminLayout>
  <div className="p-6">

    {/* HEADER */}
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-gray-800">
        Tambah Bidang
      </h1>
    </div>

    {error && (
      <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
        {error}
      </div>
    )}

    {/* GRID TOP */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* TAMBAH BIDANG */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-emerald-700 text-white px-4 py-2 rounded-t-lg text-sm font-semibold">
          Tambah Bidang
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4"
        >
          <input
            type="text"
            placeholder="Masukkan Nama Bidang Baru"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full shadow outline-none rounded-md px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "+ Tambah"}
          </button>
        </form>
      </div>

      {/* UPDATE BIDANG TERBARU */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-emerald-700 text-white px-4 py-2 rounded-t-lg text-sm font-semibold">
          Update Bidang Terbaru
        </div>

        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">No</th>
                <th className="pb-2">Bidang</th>
                <th className="pb-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jobFields.slice(0, 3).map((item, index) => (
                <tr key={item._id}>
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {jobFields.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* DAFTAR LIST BIDANG */}
    <div className="bg-white rounded-lg shadow">
      <div className="bg-emerald-700 text-white px-4 py-2 rounded-t-lg text-sm font-semibold">
        Daftar List Bidang
      </div>

      <div className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="pb-2 w-12">No</th>
              <th className="pb-2">Bidang</th>
              <th className="pb-2 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jobFields.map((item, index) => (
              <tr key={item._id}>
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}

            {jobFields.length === 0 && (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  Belum ada job field
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION DUMMY UI */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>Menampilkan 1 - {jobFields.length} dari {jobFields.length} Bidang</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded">1</button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</SuperAdminLayout>
  );
}
