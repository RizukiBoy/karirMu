// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function DocumentForm({ initialData, onSuccess, onChange }) {
//   const [resumeFile, setResumeFile] = useState(null);
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [portofolioLink, setPortofolioLink] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ======================
//   // Prefill (Edit)
//   // ======================
//   useEffect(() => {
//     if (initialData) {
//       setResumeUrl(initialData.resume_cv || "");
//       setPortofolioLink(initialData.portofolio_link || "");
//     }
//   }, [initialData]);

//   // ======================
//   // Handlers
//   // ======================
//   const handleResumeChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setResumeFile(file);
//     setResumeUrl(file.name);

//     onChange?.({
//     resumeFile: file,
//     resumeUrl: file.name,
//   });
//   };

//   const handlePortofolioChange = (e) => {
//   setPortofolioLink(e.target.value);

//   onChange?.({
//     portofolioLink: e.target.value,
//   });
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       // CV optional
//       if (resumeFile) {
//         formData.append("resume_cv", resumeFile);
//       }

//       // Portofolio optional
//       formData.append("portofolio_link", portofolioLink || "");

//       await axios.post(
//         "http://localhost:5000/api/user/document",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         }
//       );

//       alert("Dokumen berhasil disimpan");
//       onSuccess?.();
//     } catch (error) {
//       alert(error.response?.data?.message || "Gagal menyimpan dokumen");
//           console.log("STATUS:", error.response.status);
//           console.log("DATA:", error.response.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow p-6 max-w-xl">
//       <h2 className="text-lg font-semibold mb-4">Dokumen Pendukung</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Resume CV */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Resume / CV
//           </label>

//           {resumeUrl && !resumeFile && (
//             <a
//               href={resumeUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="text-blue-600 text-sm underline block mb-2"
//             >
//               Lihat CV saat ini
//             </a>
//           )}

//           <input
//             type="file"
//             accept=".pdf,.doc,.docx"
//             onChange={handleResumeChange}
//             className="w-full border rounded-lg px-3 py-2"
//           />

//           <p className="text-xs text-gray-500 mt-1">
//             Upload CV hanya jika ingin memperbarui
//           </p>
//         </div>

//         {/* Portofolio */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Link Portofolio
//           </label>
//           <input
//             type="url"
//             value={portofolioLink}
//             onChange={(e) => setPortofolioLink(e.target.value)}
//             placeholder="https://github.com/username"
//             className="w-full border rounded-lg px-3 py-2"
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           {loading ? "Menyimpan..." : "Simpan Dokumen"}
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState, useEffect } from "react";

export default function DocumentForm({ initialData, onChange }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [portofolioLink, setPortofolioLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setResumeUrl(initialData.resume_cv || "");
      setPortofolioLink(initialData.portofolio_link || "");

      onChange?.({
        resume_cv: null,
        portofolio_link: initialData.portofolio_link || "",
      });
    }
  }, [initialData]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumeUrl(file.name);

    onChange?.({
      resume_cv: file,
    });
  };

  const handlePortofolioChange = (e) => {
    const value = e.target.value;
    setPortofolioLink(value);

    onChange?.({
      portofolio_link: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Dokumen Pendukung</h2>

      <div className="space-y-4">
        {/* CV */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Resume / CV
          </label>

          {resumeUrl && !resumeFile && (
            <p className="text-sm text-gray-600 mb-2">
              CV terunggah: {resumeUrl}
            </p>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Portfolio */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Link Portofolio
          </label>
          <input
            type="url"
            value={portofolioLink}
            onChange={handlePortofolioChange}
            placeholder="https://github.com/username"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
