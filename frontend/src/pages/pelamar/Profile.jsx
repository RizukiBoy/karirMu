import { useEffect, useState } from "react";
import axios from "axios";
import PelamarLayout from "../../components/layout/PelamarLayout";

import ProfileStepper from "../../components/users/profile/ProfileStepper";

import ProfileForm from "../../components/users/step1/ProfileForm";
import ProfileSection from "../../components/users/step1/ProfileSection";
import DocumentForm from "../../components/users/step1/DocumentForm";
import DocumentSection from "../../components/users/step1/DocumentSection";

import EducationForm from "../../components/users/step2/EducationForm";
import EducationSection from "../../components/users/step2/EducationSection";

import WorkExperienceForm from "../../components/users/step3/WorkExperienceForm";
import SkillForm from "../../components/users/step3/SkillForm";
import Step3Section from "../../components/users/step3/Step3Section";

/* ======================
   VALIDATION HELPERS
====================== */
const hasText = (v) => typeof v === "string" && v.trim().length > 0;

const validateStep1 = (p) => {
  if (!p) return false;

  return (
    hasText(p.headline) &&
    hasText(p.about_me) &&
    hasText(p.location) &&
    hasText(p.whatsapp) &&
    (
      p.photo instanceof File ||
      p.resume_cv instanceof File ||
      hasText(p.portofolio_link)
    )
  );
};

export default function Profile() {
  const [activeStep, setActiveStep] = useState(1);

  // ===== STEP 1 =====
  const [profile, setProfile] = useState(null);
  const [document, setDocument] = useState(null);

  const [editingProfile, setEditingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [step1Submitted, setStep1Submitted] = useState(false);
const [step2Submitted, setStep2Submitted] = useState(false);
const [step3Submitted, setStep3Submitted] = useState(false);



  const [step1Data, setStep1Data] = useState({
  // profile
  headline: "",
  about_me: "",
  address: "",
  location: "",
  age: "",
  gender: "",
  whatsapp: "",
  photo: null,

  // document
  resume_cv: null,
  portofolio_link: "",
});

const [loadingStep1, setLoadingStep1] = useState(false);


  // ===== STEP 2 =====
  const [education, setEducation] = useState([]);

  // ===== STEP 3 =====
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);

  /* ======================
     MERGE STEP 1 DATA
  ====================== */
  const updateStep1Data = (partial) => {
    setStep1Data((prev) => ({ ...prev, ...partial }));
  };


const handleStepChange = (step) => {
  setActiveStep(step);
};

  /* ======================
     API LOADERS
  ====================== */
  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };

  const loadProfile = async () => {
    const res = await axios.get("http://localhost:5000/api/user/profile", authHeader);
    setProfile(res.data);
  };

  const loadDocument = async () => {
    const res = await axios.get("http://localhost:5000/api/user/document", authHeader);
    setDocument(res.data.data);
  };

  const loadEducation = async () => {
    const res = await axios.get("http://localhost:5000/api/user/education", authHeader);
    setEducation(res.data || []);
  };

  const loadWorkExperience = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/user/work-experience",
      authHeader
    );
    setWorkExperience(res.data || []);
  };

  const loadSkills = async () => {
    const res = await axios.get("http://localhost:5000/api/user/skill", authHeader);
    setSkills(res.data || []);
  };

  useEffect(() => {
    loadProfile();
    loadDocument();
    loadEducation();
    loadWorkExperience();
    loadSkills();
  }, []);

  /* ======================
     STEP 1 SUBMIT
  ====================== */
const submitStep1 = async () => {
  try {
    setLoadingStep1(true);

    /* ======================
       1. SUBMIT PROFILE
    ====================== */
    const profileForm = new FormData();

    const profileFields = [
      "headline",
      "about_me",
      "address",
      "location",
      "age",
      "gender",
      "whatsapp",
      "photo",
    ];

    profileFields.forEach((key) => {
      const value = step1Data[key];
      if (value !== null && value !== "") {
        profileForm.append(key, value);
      }
    });

    await axios.post(
      "http://localhost:5000/api/user/profile",
      profileForm,
      authHeader
    );

    /* ======================
       2. SUBMIT DOCUMENT
    ====================== */
    const documentForm = new FormData();

    if (step1Data.resume_cv) {
      documentForm.append("resume_cv", step1Data.resume_cv);
    }

    documentForm.append(
      "portofolio_link",
      step1Data.portofolio_link || ""
    );

    await axios.post(
      "http://localhost:5000/api/user/document",
      documentForm,
      authHeader
    );

    /* ======================
       3. REFRESH & MARK DONE
    ====================== */
    await loadProfile();
    await loadDocument();

    setActiveStep(2); 
    setStep1Submitted(true);
    return true
  } catch (error) {
    return false;
  } finally {
    setLoadingStep1(false);
  }
};


  const refreshProfile = async () => {
  setLoadingProfile(true);

  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/profile",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setProfile(res.data);
  } catch (err) {
    if (err.response?.status === 404) {
      // ⬅️ TAMBAHKAN INI
      setProfile(null); // profile belum ada → tampilkan form
    } else {
      console.error("Gagal load profile:", err);
    }
  } finally {
    setLoadingProfile(false);
  }
};

const refreshDocument = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/document",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setDocument(res.data.data);
  } catch (err) {
    if (err.response?.status === 404) {
      setDocument(null); // belum upload dokumen
    } else {
      console.error(err);
    }
  }
};
const refreshEducation = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/education",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    // WAJIB array
    setEducation(Array.isArray(res.data.data) ? res.data.data : []);
  } catch (err) {
    if (err.response?.status === 404) {
      // belum ada data pendidikan
      setEducation([]);
    } else {
      console.error("Gagal refresh education:", err);
    }
  }
};

useEffect(() => {
  refreshProfile();
  refreshDocument();
  refreshEducation();
}, []);

const step1Complete = validateStep1(step1Data);
  const step2Complete = education.length > 0;
  const step3Complete = workExperience.length > 0 || skills.length > 0;


  return (
    <PelamarLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-24">

        {/* ===== STEPPER ===== */}
        <ProfileStepper
          activeStep={activeStep}
          onStepChange={handleStepChange}
          step1Complete={step1Complete}
          step2Complete={step2Complete}
          step3Complete={step3Complete}
        />

        {/* ==================================================
            STEP 1 — PROFILE & DOCUMENT
        ================================================== */}
        {activeStep === 1 && (
          <section className="bg-white rounded-xl shadow">
            <SectionHeader title="Profil & Dokumen" />

            <div className="p-6 space-y-6">
              {/* PROFILE */}
              {!profile || editingProfile ? (
                <ProfileForm
                  initialData={profile}
                  value={step1Data}
                  mode={profile ? "edit" : "create"}
                  onChange={updateStep1Data}
                  onCancel={() => setEditingProfile(false)}
                />
              ) : (
                <ProfileSection
                  profile={profile}
                  onEdit={() => setEditingProfile(true)}
                />
              )}

              {/* DOCUMENT */}
              {document ? (
                <DocumentSection document={document} />
              ) : (
                <DocumentForm
                  initialData={document}
                  onChange={updateStep1Data}
                />
              )}

              {/* ACTION */}
              <div className="flex justify-end pt-4">
                {!step1Submitted && (
                  <div className="flex justify-end pt-4">
                    <button
                      disabled={!step1Complete || loadingStep1}
                      onClick={async () => {
                        const success = await submitStep1();
                        if (success) setActiveStep(2);
                      }}
                      className={`px-6 py-2 rounded-lg ${
                        step1Complete
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {loadingStep1 ? "Menyimpan..." : "Lanjut"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            STEP 2 — EDUCATION
        ================================================== */}
        {activeStep === 2 && (
          <section className="bg-white rounded-xl shadow">
            <SectionHeader title="Pendidikan" />

            <div className="p-6 space-y-6">
              {/* LIST */}
              <EducationSection education={education} />

              {/* FORM */}
              <EducationForm onSuccess={loadEducation} />

              {/* ACTION */}
              {!step2Submitted && (
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-6 py-2 border rounded-lg"
                  >
                    Kembali
                  </button>

                  <button
                    disabled={!step2Complete}
                    onClick={() => {
                      setStep2Submitted(true);
                      setActiveStep(3);
                    }}
                    className={`px-6 py-2 rounded-lg ${
                      step2Complete
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Lanjut
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ==================================================
            STEP 3 — EXPERIENCE & SKILLS
        ================================================== */}
        {activeStep === 3 && (
          <section className="bg-white rounded-xl shadow">
            <SectionHeader title="Pengalaman & Keahlian" />

            {/* <div className="p-6 space-y-6">
              <WorkExperienceForm onSaved={loadWorkExperience} />
              <SkillForm onSaved={loadSkills} />

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => goToStep(2)}
                  className="px-6 py-2 border rounded-lg"
                >
                  Kembali
                </button>

                <button
                  disabled={!step3Complete}
                  onClick={() => alert("Profil lengkap 🎉")}
                  className={`px-6 py-2 rounded-lg ${
                    step3Complete
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  Selesai
                </button>
              </div>
            </div> */}

            {/* <WorkExperienceForm onSaved={(we) => setWorkExperience(prev => [...prev, we])} />
<SkillForm onSaved={(sk) => setSkills(prev => [...prev, sk])} /> */}
  <Step3Section />

<button
  disabled={workExperience.length === 0 && skills.length === 0}
  onClick={async () => {
    try {
      for (const we of workExperience) {
        await axios.post("/api/user/work-experience", we, { headers: authHeader });
      }
      for (const sk of skills) {
        await axios.post("/api/user/skill", { name_skill: sk.name_skill }, { headers: authHeader });
      }
      alert("Profil lengkap 🎉");
    } catch (err) {
      alert("Gagal menyimpan data step 3");
    }
  }}
>
  Selesai
</button>

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