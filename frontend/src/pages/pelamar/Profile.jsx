// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import UserDocumentSection from "../../components/users/userDocumentSection";
// import EducationSection from "../../components/users/EducationSection";
// import UserSkills from "../../components/users/UserSkill";
// import WorkExperience from "../../components/users/WorkExperience";
// import ProfileSection from "../../components/users/ProfileSection";

// export default function ProfileDetail() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/user/profile", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         });

//         setProfile(res.data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Memuat profil...</p>;
//   }

//   if (!profile) {
//     navigate("/user/add-profile");
//     return null;
//   }

//   return (
//     <div className="max-w-5xl mx-auto space-y-8">
//       {/* GRID 1: Profile + Dokumen */}
//       <section className="bg-white p-6 rounded-xl shadow">
//         <ProfileSection profile={profile} />

//         <div className="mt-6">
//           <UserDocumentSection />
//         </div>

//         {/* Grid khusus tombol */}
//         <div className="grid grid-cols-1 mt-6">
//           <button
//             onClick={() => navigate("/profile/edit")}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Edit Profil
//           </button>
//         </div>
//       </section>

//       {/* GRID 2: Pendidikan */}
//       <section className="bg-white p-6 rounded-xl shadow">
//         <EducationSection />
//       </section>

//       {/* GRID 3: Pengalaman + Keahlian */}
//       <section className="bg-white p-6 rounded-xl shadow">
//         <WorkExperience />
//         <div className="mt-6">
//           <UserSkills />
//         </div>
//       </section>
//     </div>
//   );
// }


// export default function ProfileDetail() {
//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-24">

//       {/* ===== Stepper ===== */}
//       <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center text-sm">
//         <Step label="1. Biodata & Dokumen" active done />
//         <Step label="2. Pendidikan" />
//         <Step label="3. Pengalaman & Keahlian" />
//       </div>

//       {/* ===== BIODATA ===== */}
//       <section className="bg-white rounded-xl shadow">
//         <SectionHeader title="Biodata" />

//         <div className="p-6 space-y-6">
//           {/* Foto */}
//           <div className="flex items-center gap-6">
//             <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
//               <span className="text-gray-400">👤</span>
//             </div>

//             <div>
//               <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50">
//                 Upload Foto
//               </button>
//               <button className="ml-3 text-sm text-red-500 hover:underline">
//                 Hapus
//               </button>
//             </div>

//             <div className="text-sm text-gray-500 ml-8">
//               <p className="font-medium text-gray-700">Profil Pelamar</p>
//               <ol className="list-decimal ml-4">
//                 <li>Min. 400 x 400px</li>
//                 <li>Max. 2MB</li>
//                 <li>Show Your Face</li>
//               </ol>
//             </div>
//           </div>

//           {/* Form Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input label="Judul Utama" placeholder="Tuliskan judul utama" />
//             <div className="md:col-span-2">
//               <Textarea label="Tentang Saya" placeholder="Tuliskan profil singkat Anda" />
//             </div>
//             <Input label="Domisili" placeholder="Pilih Kota" />
//             <Input label="Nomor Telepon (WhatsApp)" placeholder="+62" />
//             <Select label="Jenis Kelamin" options={["Laki-laki", "Perempuan"]} />
//             <Input label="Usia" placeholder="Usia / Umur" />
//             <div className="md:col-span-2">
//               <Textarea label="Alamat Lengkap" placeholder="Detail jalan, nomor gedung, dan RT/RW" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===== CV & PORTOFOLIO ===== */}
//       <section className="bg-white rounded-xl shadow">
//         <SectionHeader title="CV & Portofolio" />

//         <div className="p-6 space-y-4">
//           <div>
//             <label className="text-sm text-gray-600">
//               Unggah Dokumen CV/Resume (PDF, Maks 5MB)
//             </label>
//             <div className="flex border rounded-lg overflow-hidden mt-2">
//               <button className="px-4 py-2 bg-gray-200 text-sm">
//                 Pilih File
//               </button>
//               <div className="flex-1 px-4 py-2 text-sm text-gray-400">
//                 Placeholder
//               </div>
//             </div>
//           </div>

//           <Input label="Link Portofolio" placeholder="Tempel Tautan Disini" />
//         </div>
//       </section>

//       {/* ===== Sticky Footer ===== */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow p-4 flex justify-end">
//         <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
//           Simpan
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PelamarLayout from "../../components/layout/PelamarLayout"

import ProfileForm from "../../components/users/ProfileForm";
import ProfileSection from "../../components/users/ProfileSection";

import DocumentForm from "../../components/users/DocumentForm";
import DocumentSection from "../../components/users/DocumentSection";

import EducationForm from "../../components/users/EducationForm";
import EducationSection from "../../components/users/EducationSection";

import WorkExperienceForm from "../../components/users/WorkExperienceForm";
import WorkExperience from "../../components/users/WorkExperienceForm";
import UserSkills from "../../components/users/SkillForm";

import ProfileStepper from "../../components/users/ProfileStepper";

 // ===== VALIDATION HELPERS =====
const hasText = (v) => typeof v === "string" && v.trim().length > 0;

const validateStep1 = (p) => {
  if (!p) return false;

  return (
    hasText(p.headline) &&
    hasText(p.about_me) &&
    hasText(p.location) &&
    hasText(p.whatsapp) &&
    (
      hasText(p.cv_file) ||
      hasText(p.portfolio_link)
    )
  );
};

const validateStep2 = (p) => {
  return Array.isArray(p?.education) && p.education.length > 0;
};

const validateStep3 = (p) => {
  return (
    (Array.isArray(p?.experiences) && p.experiences.length > 0) ||
    (Array.isArray(p?.skills) && p.skills.length > 0)
  );
};


export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [editing, setEditing] = useState(false);


  const navigate = useNavigate();

// ===== STEP COMPLETE FLAGS =====
// ===== STEP COMPLETE FLAGS (DERIVED STATE) =====



const goToStep = (targetStep) => {
  // selalu boleh ke step 1
  if (targetStep === 1) {
    setActiveStep(1);
    return;
  }

  // ke step 2 hanya kalau step 1 sudah valid
  if (targetStep === 2) {
    if (!step1Complete) {
      console.warn("Step 1 belum lengkap");
      return;
    }
    setActiveStep(2);
    return;
  }

  // ke step 3 hanya kalau step 2 sudah valid
  if (targetStep === 3) {
    if (!step2Complete) {
      console.warn("Step 2 belum lengkap");
      return;
    }
    setActiveStep(3);
    return;
  }
};

  // ======== PROFILE ========

  const refreshProfile = async () => {
    setLoadingProfile(true)
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProfile(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
      setLoadingProfile(false)
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

   const [document, setDocument] = useState(null);

  const refreshDocument = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/document", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setDocument(res.data.data);
      console.log(res.data)

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshDocument();
  }, []);

  const [education, setEducation] = useState(null);

  const refreshEducation = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/education", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEducation(res.data);
      console.log(res.data)

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshEducation();
  }, []);

  // // ======== SKILLS ========
  const [skills, setSkills] = useState(null);

  const refreshSkills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/skill", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSkills(res.data);
      console.log(res.data)

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshSkills();
  }, []);

  // // ======== WORK EXPERIENCE ========
  const [workExperience, setWorkExperience] = useState(null);

  const refreshWorkExperience = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/work-experience", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setWorkExperience(res.data);
      console.log(res.data)

    } catch (err) {
      console.error(err);
      
    }
  };

  useEffect(() => {
    refreshWorkExperience();
  }, []);


const step1Complete = Boolean(profile && document);
const step2Complete = Boolean(education);
const step3Complete = Boolean(
  workExperience?.length > 0
);

  return (
    <PelamarLayout>
    <div className="max-w-6xl mx-auto space-y-6 pb-24">

      {/* ===== Stepper ===== */}
    <ProfileStepper
      activeStep={activeStep}
      onStepChange={goToStep}
      step1Complete={step1Complete}
      step2Complete={step2Complete}
      step3Complete={step3Complete}
    />

      {/* ===== TAB 1: BIODATA + DOKUMEN ===== */}
      {activeStep === 1 && (
        <section className="bg-white rounded-xl shadow">
          <SectionHeader title="Biodata & Dokumen" />
          <div className="p-6 space-y-6">

    {!profile || editing ? (
      <ProfileForm
        mode={profile ? "edit" : "create"}
        initialData={profile}
        onSaved={(data) => {
          setProfile(data);
          setEditing(false);   // 🔥 balik ke section
        }}
        onCancel={() => setEditing(false)}
      />
    ) : (
      <ProfileSection
        profile={profile}
        onEdit={() => setEditing(true)}   // 🔥 buka form edit
      />
    )}



            {document ? (
              <DocumentSection document={document} onSaved={refreshDocument} />
            ) : (
              <DocumentForm onEdit={() => setDocument(null)} />
            )}


            {/* ACTION BAR */}
            <div className="flex justify-end pt-4">
              <button
                disabled={!step1Complete}
                onClick={() => goToStep(2)}
                className={`px-6 py-2 rounded-lg ${
                  step1Complete
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Lanjut
              </button>
            </div>
          </div>
        </section>
      )}


      {/* ===== TAB 2: PENDIDIKAN ===== */}
      {activeStep === 2 && (
        <section className="bg-white rounded-xl shadow">
          <SectionHeader title="Pendidikan" />

          <div className="p-6 space-y-6">
          {!education ? (
            <EducationForm onSaved={refreshEducation} />
          ) : (
            <EducationSection education={education} onEdit={() => setEducation(null)} />
          )}

            {/* ACTION BAR */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => goToStep(1)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Kembali
              </button>

              <button
                disabled={!step2Complete}
                onClick={() => goToStep(3)}
                className={`px-6 py-2 rounded-lg ${
                  step2Complete
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Lanjut
              </button>
            </div>
          </div>
        </section>
      )}


      {/* ===== TAB 3: PENGALAMAN + KEAHLIAN ===== */}
      {activeStep === 3 && (
        <section className="bg-white rounded-xl shadow">
          <SectionHeader title="Pengalaman & Keahlian" />

          <div className="p-6 space-y-6">
          {!workExperience ? (
            <WorkExperienceForm onSaved={refreshWorkExperience} />
          ) : (
            <WorkExperienceForm onEdit={() => setWorkExperience(null)} />
          )}


            {/* ACTION BAR */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => goToStep(2)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Kembali
              </button>

              <button
                disabled={!step3Complete}
                onClick={() => alert("Profil lengkap 🎉")}
                className={`px-6 py-2 rounded-lg ${
                  step3Complete
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
    </PelamarLayout>
  );
}

export function SectionHeader({ title }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-green-600 text-white px-6 py-3 rounded-t-xl font-semibold">
      {title}
    </div>
  );
}

export function StepButton({ label, active, done, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-left
        ${
          active
            ? "bg-blue-50 border border-blue-600"
            : "hover:bg-gray-50 border border-transparent"
        }`}
    >
      {/* Circle */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
          ${
            done
              ? "bg-green-500 text-white"
              : active
              ? "border-2 border-blue-600 text-blue-600"
              : "border text-gray-400"
          }`}
      >
        {done ? "✓" : ""}
      </div>

      {/* Label */}
      <div>
        <p
          className={`text-sm ${
            active ? "text-blue-600 font-medium" : "text-gray-700"
          }`}
        >
          {label}
        </p>

        {!done && !active && (
          <p className="text-xs text-red-500">Incomplete step</p>
        )}
      </div>
    </button>
  );
}


export function Input({ label, placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function Textarea({ label, placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={4}
        className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function Select({ label, options }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Pilih</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}