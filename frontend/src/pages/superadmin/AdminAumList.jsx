import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminAumList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  const token = localStorage.getItem("superadminToken");

  const fetchAdmins = async () => {



    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/admin-aum",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.data || []);
                    console.log(res.data.data)

    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data admin AUM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [location.pathname]);

  const documentProgress = (verification) => {
  if (!verification || verification.total_documents === 0)
    return (
      <span className="text-xs text-gray-500">
        Belum ada dokumen
      </span>
    );

  return (
    <span className="text-xs text-gray-600">
      {verification.approved_count} / {verification.total_documents} dokumen
    </span>
  );
};


 const statusBadge = (verification) => {
  if (!verification)
    return (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
        Tidak ada data
      </span>
    );

  if (verification.status === "approved")
    return (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
        Verified
      </span>
    );

  if (verification.status === "rejected")
    return (
      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
        Rejected
      </span>
    );

  return (
    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
      Pending
    </span>
  );
};


  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Daftar Admin AUM</h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-3">Nama Admin</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Perusahaan</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-center px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Tidak ada data admin AUM
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.company_id} className="border-t">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.company_name || "-"}</td>
                  <td className="px-4 py-3 space-y-1">
                            {statusBadge(item.verification)}
                            <div>{documentProgress(item.verification)}</div>
                    </td>
                  <td className="px-4 py-3 text-center">
                    <button
                    onClick={() =>
                        navigate(`/super-admin/detail/${item.company_id}`)
                    }
                    className="text-emerald-600 hover:underline text-sm"
                    >
                    Detail
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
