import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import AdminSuperLayout from "../../components/layout/SuperAdminLayout";

const STATUS_BADGE_MAP = {
  approved: {
    label: "Diterima",
    class: "bg-[#25A249]",
  },
  rejected: {
    label: "Ditolak",
    class: "bg-[#DA1E28]",
  },
  pending: {
    label: "Pending",
    class: "bg-[#F1C21B]",
  },
};

export default function PengajuanAum() {
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
      alert("Gagal mengambil data pengajuan AUM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [location.pathname]);

  const getStatusUI = (verification) => {
    if (!verification || !verification.status) {
      return STATUS_BADGE_MAP.pending;
    }
    return STATUS_BADGE_MAP[verification.status] || STATUS_BADGE_MAP.pending;
  };

  const documentProgress = (verification) => {
    if (!verification || verification.total_documents === 0) {
      return "Belum ada dokumen";
    }
    return `${verification.approved_count} / ${verification.total_documents} dokumen`;
  };

  if (loading) {
    return (
      <AdminSuperLayout>
        <p className="text-sm text-gray-500">Loading...</p>
      </AdminSuperLayout>
    );
  }

  return (
    <AdminSuperLayout>
      <div className="space-y-6">
        {/* ================= FILTER STATUS ================= */}
        <div
          className="px-4 py-3 rounded-t-lg text-white text-sm font-medium"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Filter Status
        </div>

        <div className="bg-white rounded-b-xl shadow p-4">
          <div className="flex gap-3 flex-wrap">
            {[
              `Semua (${data.length})`,
              `Pending (${data.filter((d) => d?.verification?.status === "pending").length})`,
              `Diterima (${data.filter((d) => d?.verification?.status === "approved").length})`,
              `Ditolak (${data.filter((d) => d?.verification?.status === "rejected").length})`,
            ].map((item) => (
              <button
                key={item}
                className="
                  px-5 py-2
                  rounded-full
                  border border-[#409144]
                  text-[#409144]
                  text-sm font-medium
                  hover:bg-[#409144]/10
                  transition
                "
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TITLE LIST ================= */}
        <div
          className="px-4 py-3 rounded-t-lg text-white text-sm font-medium"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Daftar Pengajuan Akun AUM
        </div>

        {/* ================= LIST CARD ================= */}
        {data.length === 0 ? (
          <div className="bg-white rounded-b-xl shadow p-6 text-center text-gray-500">
            Tidak ada data pengajuan AUM
          </div>
        ) : (
          data.map((item) => {
            const statusUI = getStatusUI(item.verification);

            return (
              <div
                key={item.company_id}
                className="bg-white rounded-b-xl shadow p-5 space-y-4"
              >
                {/* TITLE */}
                <h3 className="font-semibold text-gray-800">
                  {item.company_name || item.name || "-"}
                </h3>

                {/* INFO */}
                <p className="text-xs text-gray-500">
                  Kategori | Tanggal Pengajuan:{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </p>

                <div className="h-px bg-gray-200" />
                {/* STATUS */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`flex px-3 py-1 text-xs rounded-full text-white ${statusUI.class}`}
                  >
                    <p className="mr-4">

                    {statusUI.label}
                    </p>

                    {item.verification.approved_count}

                  </span>
                </div>

                {/* PESAN */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Alasan / Pesan (Opsional)
                  </p>

                  <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 h-24">
                    {item.verification?.message || "-"}
                  </div>
                </div>

                {/* ACTION */}
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin-super/detail-pengajuan-aum/${item.company_id}`
                      )
                    }
                    className="
                      px-4 py-1.5
                      border border-[#409144]
                      text-[#409144]
                      rounded-full
                      text-sm
                      hover:bg-[#409144]/10
                      transition
                    "
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* ================= PAGINATION (dummy UI) ================= */}
        <div className="bg-white rounded-lg shadow-sm px-6 py-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Menampilkan <b>1–{data.length}</b> dari <b>{data.length}</b> AUM
          </span>

          <div className="flex items-center gap-4">
            <button className="hover:underline">&lt; Prev</button>

            {[1].map((p) => (
              <button
                key={p}
                className="
                  w-7 h-7 flex items-center justify-center rounded
                  border border-[#409144] text-[#409144] font-semibold
                "
              >
                {p}
              </button>
            ))}

            <button className="hover:underline">Next &gt;</button>
          </div>
        </div>
      </div>
    </AdminSuperLayout>
  );
}
