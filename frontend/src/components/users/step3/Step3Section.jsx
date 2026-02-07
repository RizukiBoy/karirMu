import { useEffect, useState } from "react";
import axios from "axios";
import WorkExperienceForm from "./WorkExperienceForm";
import SkillForm from "./SkillForm";

export default function Step3Section() {
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  // =========================
  // FETCH DATA DARI DATABASE
  // =========================
  const fetchWorkExperience = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/work-experience",
        { headers }
      );
      setWorkExperience(res.data || []);
    } catch (err) {
      console.error("Gagal load pengalaman kerja:", err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/skill", { headers });
      setSkills(res.data.data || []);
    } catch (err) {
      console.error("Gagal load skills:", err);
    }
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchWorkExperience();
    fetchSkills();
  }, []);

  // =========================
  // SUBMIT SEMUA DATA BARU
  // =========================
  const handleSubmitAll = async () => {
    if (workExperience.length === 0 && skills.length === 0) {
      return alert("Tambahkan minimal 1 pengalaman kerja atau skill");
    }

    try {
      setLoading(true);

      // Submit Work Experience baru
      for (const we of workExperience) {
        if (we._id) continue; // skip data yang sudah ada di DB
        await axios.post(
          "http://localhost:5000/api/user/work-experience",
          we,
          { headers }
        );
      }

      // Submit Skills baru
      for (const sk of skills) {
        if (sk._id) continue; // skip data yang sudah ada di DB
        await axios.post(
          "http://localhost:5000/api/user/skill",
          { name_skill: sk.name_skill },
          { headers }
        );
      }

      alert("Profil lengkap 🎉");

      // Refresh data dari database
      fetchWorkExperience();
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data step 3");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold">Pengalaman & Keahlian</h2>

     
      {/* Preview Work Experience */}
      {workExperience.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="font-medium">Preview Pengalaman Kerja</h3>
          {workExperience.map((we, idx) => (
            <div key={we._id || idx} className="border rounded-lg p-4 text-sm flex justify-between items-start">
              <div>
                <p className="font-medium">{we.job_title}</p>
                <p>{we.company_name}</p>
                <p className="text-gray-600">
                  {we.start_date} – {we.end_date || "Sekarang"}
                </p>
                {we.description && <p className="text-gray-600">{we.description}</p>}
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={() => setWorkExperience(prev => prev.filter((_, i) => i !== idx))}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

       {/* Form Tambah Work Experience */}
      <WorkExperienceForm onSaved={(we) => setWorkExperience(prev => [...prev, we])} />

    {/* Preview Skills */}
      {skills.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="font-medium">Preview Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <div
                key={sk._id || idx}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                <span>{sk.name_skill}</span>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setSkills(prev => prev.filter((_, i) => i !== idx))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Form Tambah Skill */}
      <SkillForm onSaved={(sk) => setSkills(prev => [...prev, sk])} />


      {/* Tombol Selesai */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmitAll}
          disabled={loading || (workExperience.length === 0 && skills.length === 0)}
          className={`px-6 py-2 rounded-lg ${
            workExperience.length > 0 || skills.length > 0
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Menyimpan..." : "Selesai"}
        </button>
      </div>
    </section>
  );
}
