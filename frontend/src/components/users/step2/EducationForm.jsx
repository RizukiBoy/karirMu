import { useState } from "react";
import axios from "axios";

const STUDY_LEVELS = [
  "SMA/SMK Sederajat",
  "SLB",
  "Kuliah",
];

export default function EducationForm({ onSuccess }) {
  const [form, setForm] = useState({
    study_level: "",
    institution: "",
    major: "",
    graduate_status: "belum_lulus",
    graduate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    if (!form.study_level || !form.institution) return;
    if (form.graduate_status === "lulus" && !form.graduate) return;

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/user/education",
        {
          study_level: form.study_level,
          institution: form.institution,
          major: form.major,
          graduate:
            form.graduate_status === "lulus"
              ? Number(form.graduate)
              : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // reset form
      setForm({
        study_level: "",
        institution: "",
        major: "",
        graduate_status: "belum_lulus",
        graduate: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-5 space-y-4">
      <h3 className="font-medium text-sm">Tambah Pendidikan</h3>

      {/* Jenjang Pendidikan */}
      <select
        value={form.study_level}
        onChange={(e) =>
          handleChange("study_level", e.target.value)
        }
        className="w-full border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Pilih Jenjang</option>
        {STUDY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      {/* Institusi */}
      <input
        type="text"
        placeholder="Nama Institusi"
        value={form.institution}
        onChange={(e) =>
          handleChange("institution", e.target.value)
        }
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      {/* Jurusan */}
      <input
        type="text"
        placeholder="Jurusan (opsional)"
        value={form.major}
        onChange={(e) =>
          handleChange("major", e.target.value)
        }
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      {/* Status Kelulusan */}
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.graduate_status === "belum_lulus"}
            onChange={() =>
              handleChange("graduate_status", "belum_lulus")
            }
          />
          Belum Lulus
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.graduate_status === "lulus"}
            onChange={() =>
              handleChange("graduate_status", "lulus")
            }
          />
          Sudah Lulus
        </label>
      </div>

      {/* Tahun Lulus */}
      {form.graduate_status === "lulus" && (
        <input
          type="number"
          placeholder="Tahun Lulus"
          value={form.graduate}
          onChange={(e) =>
            handleChange("graduate", e.target.value)
          }
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      )}

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}




// import { useState } from "react";

// const STUDY_LEVELS = ["SMA/SMK Sederajat", "SLB", "Kuliah"];

// export default function EducationForm({ onAdd }) {
//   const [form, setForm] = useState({
//     study_level: "",
//     institution: "",
//     major: "",
//     graduate_status: "belum_lulus",
//     graduate: "",
//   });

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   // tombol "Tambah" → simpan ke parent state
//   const handleAdd = () => {
//     if (!form.study_level || !form.institution) return;
//     if (form.graduate_status === "lulus" && !form.graduate) return;

//     // panggil callback parent untuk menambahkan entry
//     onAdd({ ...form });

//     // reset form untuk entry baru
//     setForm({
//       study_level: "",
//       institution: "",
//       major: "",
//       graduate_status: "belum_lulus",
//       graduate: "",
//     });
//   };

//   return (
//     <div className="border rounded-xl p-5 space-y-4">
//       <h3 className="font-medium text-sm">Tambah Pendidikan</h3>

//       <select
//         value={form.study_level}
//         onChange={(e) => handleChange("study_level", e.target.value)}
//         className="w-full border rounded-lg px-3 py-2 text-sm"
//       >
//         <option value="">Pilih Jenjang</option>
//         {STUDY_LEVELS.map((level) => (
//           <option key={level} value={level}>
//             {level}
//           </option>
//         ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Nama Institusi"
//         value={form.institution}
//         onChange={(e) => handleChange("institution", e.target.value)}
//         className="w-full border rounded-lg px-3 py-2 text-sm"
//       />

//       <input
//         type="text"
//         placeholder="Jurusan (opsional)"
//         value={form.major}
//         onChange={(e) => handleChange("major", e.target.value)}
//         className="w-full border rounded-lg px-3 py-2 text-sm"
//       />

//       <div className="flex gap-6 text-sm">
//         <label className="flex items-center gap-2">
//           <input
//             type="radio"
//             checked={form.graduate_status === "belum_lulus"}
//             onChange={() => handleChange("graduate_status", "belum_lulus")}
//           />
//           Belum Lulus
//         </label>

//         <label className="flex items-center gap-2">
//           <input
//             type="radio"
//             checked={form.graduate_status === "lulus"}
//             onChange={() => handleChange("graduate_status", "lulus")}
//           />
//           Sudah Lulus
//         </label>
//       </div>

//       {form.graduate_status === "lulus" && (
//         <input
//           type="number"
//           placeholder="Tahun Lulus"
//           value={form.graduate}
//           onChange={(e) => handleChange("graduate", e.target.value)}
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />
//       )}

//       <div className="flex justify-end">
//         <button
//           onClick={handleAdd}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
//         >
//           Tambah
//         </button>
//       </div>
//     </div>
//   );
// }
