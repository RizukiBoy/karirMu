import { useState } from "react";
import JobEditForm from "./adminAum/JobEditForm";
const JobDetailModal = ({ job, onClose }) => {
  if (!job) return null;


  const [editMode, setEditMode] = useState(false);
  const [currentJob, setCurrentJob] = useState(job);
  const canEditJob = () => {
  const role = localStorage.getItem("role");

  if(role === "company_hrd") return true
}


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl mx-4 shadow-xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="p-6 border-b flex items-center gap-4">
          <img
            src={currentJob.company?.logo_url}
            alt="logo"
            className="w-14 h-14 object-contain rounded"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {currentJob.job_name}
            </h2>
            <p className="text-sm text-gray-500">
              {currentJob.company?.company_name} • {currentJob.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto text-sm">
          {editMode ? (
            <JobEditForm
              job={currentJob}
              onCancel={() => setEditMode(false)}
              onSuccess={(updatedJob) => {
                setCurrentJob(updatedJob);
                setEditMode(false);
              }}
            />
          ) : (
            <div className="space-y-6">
              {/* INFO GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info label="Lokasi" value={currentJob.location} />
                <Info label="Tipe" value={currentJob.type} />
                <Info label="Kategori" value={currentJob.category} />
                <Info
                  label="Gaji"
                  value={
                    currentJob.salary_min && currentJob.salary_max
                      ? `Rp ${currentJob.salary_min.toLocaleString()} - Rp ${currentJob.salary_max.toLocaleString()}`
                      : "Dirahasiakan"
                  }
                />
              </div>

              {/* DESKRIPSI */}
              <section>
                <h3 className="font-semibold mb-2">Deskripsi Pekerjaan</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {currentJob.description || "-"}
                </p>
              </section>

              {/* KUALIFIKASI */}
              <section>
                <h3 className="font-semibold mb-2">Kualifikasi</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {currentJob.requirement || "-"}
                </p>
              </section>

              {/* BENEFIT */}
              {currentJob.benefit && (
                <section>
                  <h3 className="font-semibold mb-2">Benefit</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {currentJob.benefit}
                  </p>
                </section>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!editMode && (
          <div className="p-6 border-t flex gap-3">
            <button
              className="flex-1 bg-emerald-600 text-white rounded-xl py-2 hover:bg-emerald-700 transition"
            >
              Lamar Sekarang
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-xl py-2"
            >
              Tutup
            </button>
          </div>
        )}

        {/* EDIT BUTTON */}
        {!editMode && canEditJob() && (
          <div className="border-t p-4 flex justify-end">
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Edit Lowongan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* helper kecil, tetap satu file */
const Info = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">
      {value || "-"}
    </p>
  </div>
);

export default JobDetailModal;
