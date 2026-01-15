import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminAumDetail() {
  const { companyId } = useParams();
  const token = localStorage.getItem("adminAccessToken");

  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil detail admin AUM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  // const verifyDocument = async (docId, status) => {
  //   try {
  //     await axios.patch(
  //       `http://localhost:5000/api/admin/company-documents/${docId}`,
  //       { status },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     fetchDetail();
  //   } catch (err) {
  //     alert("Gagal memverifikasi dokumen");
  //   }
  // };

  const verifyDocument = async (documentId, status) => {
  if (!window.confirm(`Yakin ingin ${status === "APPROVED" ? "approve" : "reject"} dokumen ini?`)) {
    return;
  }

  

  try {
    await axios.patch(
      `http://localhost:5000/api/admin/admin-aum/document/${documentId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      }
    );

    // refresh data
    fetchDetail();
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message ||
      "Gagal memverifikasi dokumen"
    );
  }
};


  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!company) return <p>Data tidak ditemukan</p>;

  return (
    <div className="space-y-6">
      {/* ================= COMPANY INFO ================= */}
      <div className="border rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-4">
          <img
            src={company.logo_url}
            alt="Logo"
            className="w-16 h-16 object-contain border rounded"
          />
          <div>
            <h2 className="text-lg font-semibold">{company.company_name}</h2>
            <p className="text-sm text-gray-600">{company.industry}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <p><b>Email:</b> {company.company_email}</p>
          <p><b>Telepon:</b> {company.company_phone}</p>
          <p><b>Alamat:</b> {company.address}</p>
          <p><b>Kota:</b> {company.city}, {company.province}</p>
          <p><b>Jumlah Karyawan:</b> {company.employee_range}</p>
          <p>
            <b>Website:</b>{" "}
            <a
              href={company.company_url}
              target="_blank"
              className="text-emerald-600 underline"
            >
              {company.company_url}
            </a>
          </p>
        </div>

        {company.description && (
          <p className="text-sm text-gray-700 mt-2">
            {company.description}
          </p>
        )}
      </div>

      {/* ================= DOCUMENTS ================= */}
      <div className="border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold">Dokumen Perusahaan</h3>

        {documents.length === 0 ? (
          <p className="text-sm text-gray-500">
            Tidak ada dokumen
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{doc.document_name}</p>
                <a
                  href={doc.document_url}
                  target="_blank"
                  className="text-sm text-emerald-600 underline"
                >
                  Lihat dokumen
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  Status: {doc.status}
                </p>
              </div>

<div className="flex items-center gap-3">
  {/* ===== BADGE STATUS ===== */}
  {doc.status === "approved" && (
    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded">
      Approved
    </span>
  )}

  {doc.status === "rejected" && (
    <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded">
      Rejected
    </span>
  )}

  {/* ===== ACTION BUTTONS ===== */}
  {doc.status === "pending" && (
    <>
      <button
        onClick={() => verifyDocument(doc._id, "approved")}
        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        Approve
      </button>

      <button
        onClick={() => verifyDocument(doc._id, "rejected")}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reject
      </button>
    </>
  )}
</div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
