import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import AdminSuperLayout from "../../components/layout/SuperAdminLayout";

// ICON
import { Document } from "iconsax-reactjs";

const DetailPengajuanAum = () => {
  const { companyId } = useParams();
  const token = localStorage.getItem("adminAccessToken");

  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [error, setError] = useState(null);


  const fetchDetail = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/admin-aum/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompany(res.data.company);
      setDocuments(res.data.documents || []);

      setNotes(res.data.company?.notes || [])
      console.log(res.data.company)
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil detail AUM");
    } finally {
      setLoading(false);
    }
  };

  const verifyDocument = async (documentId, status) => {
    if (
      !window.confirm(
        `Yakin ingin ${status === "approved" ? "menyetujui" : "menolak"} dokumen ini?`
      )
    )
      return;

    try {
      await axios.patch(
        `http://localhost:5000/api/admin/admin-aum/document/${documentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memverifikasi dokumen");
    }
  };

  const fetchIndustries = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/industries");
    setIndustries(res.data.data);
  } catch (err) {
    setError("Gagal mengambil industries");
  }
};
const getIndustryName = (industryId) => {
  const industry = industries.find((i) => i._id === industryId);
  return industry?.name || "-";
};


  useEffect(() => {
    fetchDetail();
    fetchIndustries();
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!company) return <p>Data tidak ditemukan</p>;


  const hasPendingDoc = documents.some((d) => d.status === "pending");
const hasRejectedDoc = documents.some((d) => d.status === "rejected");

// const handleFinalDecision = async (finalStatus) => {
//   // finalStatus: "approved" atau "rejected"
//   const statusBoolean = finalStatus === "approved"; // true = approved, false = rejected

//   // Validasi dokumen pending
//   if (statusBoolean && documents.some((d) => d.status === "pending")) {
//     return alert("Masih ada dokumen yang belum diverifikasi");
//   }

//   // Validasi jika ada dokumen ditolak tapi catatan kosong
//   if (statusBoolean && documents.some((d) => d.status === "rejected") && !notes.trim()) {
//     return alert("Wajib isi catatan jika ada dokumen ditolak");
//   }

//   if (
//     !window.confirm(
//       `Yakin ingin ${
//         statusBoolean ? "MENYETUJUI" : "MENOLAK"
//       } pengajuan AUM ini?`
//     )
//   )
//     return;

//   try {
//     setSubmitting(true);

//     // PATCH ke endpoint verifyCompanyAccount
//     await axios.patch(
//       `http://localhost:5000/api/admin/${companyId}/verify-account`,
//       {
//         status: statusBoolean,
//         notes: notes,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     alert("Pengajuan berhasil diproses");
//     navigate("/super-admin/pengajuan-aum");
//   } catch (err) {
//     alert(err.response?.data?.message || "Gagal memproses pengajuan");
//   } finally {
//     setSubmitting(false);
//   }
// };

  const handleFinalDecision = async () => {
    const isAllApproved =
      documents.length === 4 &&
      documents.every((d) => d.status === "approved");

    // jika ada dokumen rejected → catatan wajib
    if (!isAllApproved && documents.some((d) => d.status === "rejected") && !notes.trim()) {
      return alert("Wajib isi catatan jika ada dokumen ditolak");
    }

    if (
      !window.confirm(
        "Yakin ingin menyimpan hasil verifikasi pengajuan AUM ini?"
      )
    )
      return;

    try {
      setSubmitting(true);

      await axios.patch(
        `http://localhost:5000/api/admin/${companyId}/verify-account`,
        {
          status: isAllApproved, // ⬅️ otomatis
          notes: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pengajuan berhasil disimpan");
      navigate("/super-admin/pengajuan-aum");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan pengajuan");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <AdminSuperLayout>
      <div className="space-y-6">

        {/* ===============================
            INFORMASI UMUM
        =============================== */}
        <div
          className="px-4 py-3 rounded-t-lg font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Informasi Umum
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-b-xl shadow p-6 space-y-3 text-sm line-clamp-1">
            <Info label="Nama Perusahaan" value={company.company_name} />
            <Info label="No Telepon" value={company.company_phone} />
            <Info label="Provinsi" value={company.province} />
            <Info label="Bidang Industri" value={getIndustryName(company.industry_id)} />
          </div>

          <div className="bg-white rounded-b-xl shadow p-6 space-y-3 text-sm">
            <Info label="Email Perusahaan" value={company.company_email} />
            <Info label="Website Resmi" value={company.company_url} />
            <Info label="Kota / Kabupaten" value={company.city} />
            <Info label="Jumlah Karyawan" value={company.employee_range} />
          </div>
        </div>

        {/* ===============================
            DESKRIPSI & ALAMAT
        =============================== */}
        <div className="bg-white rounded-b-xl shadow p-6 space-y-4 text-sm">
          <Info label="Deskripsi" value={company.description || "-"} />
          <Info label="Alamat Lengkap" value={company.address} />
        </div>

        {/* ===============================
            DOKUMEN LEGALITAS
        =============================== */}
        <div
          className="px-4 py-3 rounded-t-lg font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Dokumen Legalitas
        </div>

        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada dokumen</p>
          ) : (
            documents.map((doc) => (
              <DokumenCard
                key={doc._id}
                title={doc.document_name}
                fileUrl={doc.document_url}
                status={doc.status}
                onApprove={() => verifyDocument(doc._id, "approved")}
                onReject={() => verifyDocument(doc._id, "rejected")}
              />
            ))
          )}
        </div>

        {/* ===============================
            AREA KEPUTUSAN
        =============================== */}
        <div
          className="px-4 py-3 rounded-t-lg font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Area Keputusan
        </div>

        <div className="bg-white rounded-b-xl shadow p-6">
          <textarea
            rows={4}
            placeholder="Tuliskan catatan untuk Admin AUM"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#409144]"
          />
        </div>

        {/* ===============================
            AKSI
        =============================== */}
        <div
          className="px-4 py-3 rounded-t-lg font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Aksi
        </div>

{/* <div className="bg-white rounded-b-xl shadow p-4 flex justify-end gap-3">
  <button
    disabled={submitting}
    onClick={() => handleFinalDecision("rejected")}
    className="px-6 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
  >
    Tolak
  </button>

  <button
    disabled={submitting}
    onClick={() => handleFinalDecision("approved")}
    className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
  >
    Setujui & Aktifkan
  </button>
</div> */}

<div className="bg-white rounded-b-xl shadow p-4 flex justify-end gap-3">
  <button
    onClick={() => navigate(-1)}
    className="px-6 py-2 rounded-lg bg-gray-500 text-white text-sm font-medium"
  >
    Kembali
  </button>

  <button
    disabled={submitting}
    onClick={handleFinalDecision}
    className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
  >
    Simpan
  </button>
</div>

      </div>
    </AdminSuperLayout>
  );
};

export default DetailPengajuanAum;

/* ===============================
   KOMPONEN BANTUAN
================================ */

const Info = ({ label, value }) => (
  <div className="flex gap-4">
    <span className="min-w-38 text-gray-600">{label}</span>
    <span className="font-medium text-gray-800 truncate">: {value}</span>
  </div>
);

const DokumenCard = ({
  title,
  fileUrl,
  status,
  onApprove,
  onReject,
}) => (
  <div className="bg-white rounded-xl shadow p-5 space-y-4">
    <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
      <span>{title}</span>
    </div>

    <div className="flex items-center justify-between">
      <a
        href={fileUrl}
        target="_blank"
        className="flex items-center gap-2 text-sm font-medium text-[#409144] hover:underline"
      >
        <Document className="w-6 h-6" />
        Lihat File
      </a>

      {status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm"
          >
            Setujui
          </button>
          <button
            onClick={onReject}
            className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm"
          >
            Tolak
          </button>
        </div>
      )}

      {status === "approved" && (
        <span className="text-sm text-green-600 font-medium">
          Approved
        </span>
      )}

      {status === "rejected" && (
        <span className="text-sm text-red-600 font-medium">
          Rejected
        </span>
      )}
    </div>
  </div>
);


const handleFinalDecision = async (finalStatus) => {
  if (finalStatus === "approved" && hasPendingDoc) {
    return alert("Masih ada dokumen yang belum diverifikasi");
  }

  if (finalStatus === "approved" && hasRejectedDoc && !notes.trim()) {
    return alert("Wajib isi catatan jika ada dokumen ditolak");
  }

  if (
    !window.confirm(
      `Yakin ingin ${
        finalStatus === "approved" ? "MENYETUJUI" : "MENOLAK"
      } pengajuan AUM ini?`
    )
  )
    return;

  try {
    setSubmitting(true);

    await axios.patch(
      `http://localhost:5000/api/admin/admin-aum/${companyId}/verify`,
      {
        status: finalStatus,
        notes: notes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Pengajuan berhasil diproses");
    navigate("/super-admin/pengajuan-aum");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal memproses pengajuan");
  } finally {
    setSubmitting(false);
  }
};
