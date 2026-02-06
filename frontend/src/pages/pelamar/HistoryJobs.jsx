import React, { useEffect, useState } from "react";
import axios from "axios";
import PelamarLayout from "../../components/layout/PelamarLayout";
import { useNavigate } from "react-router-dom"
// ICONSAX
import {
  Briefcase,
  Location,
  Calendar,
  User,
} from "iconsax-reactjs";

const HistoryJobs = () => {
  const [dataLamaran, setDataLamaran] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Semua");

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken"); // atau dari context

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/applied-jobs",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data)
      // transform agar cocok ke UI lama
      const mapped = res.data.map((item) => ({
        jobId : item.job._id,
        posisi: item.job.job_name,
        gaji: `Rp ${Number(item.job.salary_min).toLocaleString("id-ID")}–${Number(
          item.job.salary_max
        ).toLocaleString("id-ID")}`,
        perusahaan: item.company.company_name, // kalau mau join company nanti bisa diganti nama
        lokasi: item.job.location,
        tanggal: new Date(item.apply_date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        status:
          item.apply_status === "accepted"
            ? "Lolos"
            : item.apply_status === "rejected"
            ? "Ditolak"
            : "Ditinjau",
        pesan:
          item.hrd_notes ||
          "Selamat! Lamaran Anda diterima. Silakan cek Email secara berkala.",
      }));

      setDataLamaran(mapped);
    } catch (err) {
      console.error("Gagal fetch lamaran:", err);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Lolos":
        return "bg-[#409144] text-white";
      case "Ditolak":
        return "bg-[#DA1E28] text-white";
      case "Ditinjau":
        return "bg-[#F1C21B] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const filteredLamaran =
  filterStatus === "Semua"
    ? dataLamaran
    : dataLamaran.filter((item) => item.status === filterStatus);


  return (
    <PelamarLayout>
      <div className="space-y-6 ml-4">
        {/* FILTER STATUS HEADER */}
        <div
          className="px-4 py-3 rounded-t-2xl font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Filter Status
        </div>

        {/* FILTER STATUS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Filter Status</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Semua", value: "Semua" },
            { label: "Pending", value: "Ditinjau" },
            { label: "Diterima", value: "Lolos" },
            { label: "Tolak", value: "Ditolak" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setFilterStatus(item.value)}
              className={`px-4 py-1.5 border rounded-full text-sm transition
                ${
                  filterStatus === item.value
                    ? "bg-green-600 text-white border-green-600"
                    : "border-green-600 text-green-600 hover:bg-green-50"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
        </div>

        {/* DAFTAR LAMARAN HEADER */}
        <div
          className="px-4 py-3 rounded-t-2xl font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Daftar Lamaran
        </div>

        {/* GRID CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {filteredLamaran.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-5 w-552px h-472px flex flex-col"
            >
              {/* HEADER */}
              <div className="space-y-6">
                {/* POSISI & GAJI */}
                <div className="flex justify-between items-start">
                  <h4 className="text-sm text-gray-800 font-semibold">
                    {item.posisi}
                  </h4>
                  <span className="text-sm text-blue-600 font-medium">
                    {item.gaji}
                  </span>
                </div>

                {/* NAMA PERUSAHAAN */}
                <div className="flex items-center gap-3 text-blue-600 font-medium">
                  <Briefcase size="20" color="#2563EB" variant="Bold" />
                  <span className="text-lg leading-tight">
                    {item.perusahaan}
                  </span>
                </div>

                {/* LOKASI */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Location size="20" color="#6B7280" />
                  {item.lokasi}
                </div>

                {/* TANGGAL */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size="20" color="#6B7280" />
                  Tanggal Melamar: {item.tanggal}
                </div>
              </div>

              {/* GARIS */}
              <hr className="my-4 border-gray-200" />

              {/* STATUS */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* DETAIL LOWONGAN */}
                <div className="flex justify-end mt-4">
                <button
                    onClick={() => navigate(`/jobs/${item.job_id || item.jobId || item._id}`)}
                    className="px-4 py-1.5 border border-green-600 text-green-600 rounded-full text-sm hover:bg-green-50"
                >
                    Detail Lowongan
                </button>
                </div>


              {/* PESAN */}
              <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 mt-4 flex-1">
                <p className="font-medium mb-1">Pesan untukmu:</p>
                <p className="leading-relaxed line-clamp-4">
                  {item.pesan}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PelamarLayout>
  );
};

export default HistoryJobs;
