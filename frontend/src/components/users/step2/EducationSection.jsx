export default function EducationSection({ education }) {
  if (education.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada data pendidikan
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pendidikan</h2>

      {education.map((edu, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 text-sm"
        >
          <p className="font-medium">{edu.study_level}</p>
          <p>{edu.institution}</p>

          {edu.major && (
            <p className="text-gray-600">
              Jurusan: {edu.major}
            </p>
          )}

          <p className="text-gray-600">
            Status:{" "}
            {edu.graduate
              ? `Lulus (${edu.graduate})`
              : "Belum Lulus"}
          </p>
        </div>
      ))}
    </div>
  );
}


// import { useState } from "react";
// import axios from "axios";
// import EducationForm from "./EducationForm";

// export default function EducationSection() {
//   const [educations, setEducations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // callback dari form → simpan di state sementara
//   const handleAddEducation = (edu) => {
//     setEducations((prev) => [...prev, edu]);
//   };

//   const handleSubmitAll = async () => {
//     if (educations.length === 0) return;

//     try {
//       setLoading(true);
//       for (const edu of educations) {
//         await axios.post(
//           "http://localhost:5000/api/user/education",
//           {
//             study_level: edu.study_level,
//             institution: edu.institution,
//             major: edu.major,
//             graduate: edu.graduate_status === "lulus" ? Number(edu.graduate) : null,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             },
//           }
//         );
//       }

//       alert("Semua pendidikan berhasil disimpan!");
//       setEducations([]); // reset state
//     } catch (err) {
//       console.error(err);
//       alert("Gagal menyimpan pendidikan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-semibold">Pendidikan</h2>

//       {/* List sementara */}
//       {educations.length === 0 ? (
//         <p className="text-sm text-gray-500">Belum ada data pendidikan</p>
//       ) : (
//         <div className="space-y-3">
//           {educations.map((edu, idx) => (
//             <div key={idx} className="border rounded-lg p-4 text-sm">
//               <p className="font-medium">{edu.study_level}</p>
//               <p>{edu.institution}</p>
//               {edu.major && <p className="text-gray-600">Jurusan: {edu.major}</p>}
//               <p className="text-gray-600">
//                 Status: {edu.graduate_status === "lulus" ? `Lulus (${edu.graduate})` : "Belum Lulus"}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Form untuk tambah */}
//       <EducationForm onAdd={handleAddEducation} />

//       {/* Tombol lanjut → submit ke server */}
//       {educations.length > 0 && (
//         <div className="flex justify-end">
//           <button
//             onClick={handleSubmitAll}
//             disabled={loading}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-blue-700"
//           >
//             Lanjut
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
