import { useEffect, useState } from "react";
import axios from "axios";

export default function SkillForm() {
  const [skills, setSkills] = useState([]);
  const [nameSkill, setNameSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // =======================
  // GET SKILLS
  // =======================
  const fetchSkills = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/skill",
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
      );

      setSkills(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // =======================
  // ADD SKILL
  // =======================
  const submit = async () => {
    if (!nameSkill.trim()) {
      return alert("Nama skill wajib diisi");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/user/skill",
        {
          name_skill: nameSkill,
        },
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
      );

      setNameSkill("");
      fetchSkills();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal menyimpan skill"
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // DELETE SKILL
  // =======================
  const deleteSkill = async (skillName) => {
    if (!window.confirm("Hapus skill ini?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/user/skill/${skillName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchSkills();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal menghapus skill"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= LIST SKILL ================= */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span>{skill.name_skill}</span>
              <button
                onClick={() => deleteSkill(skill.name_skill)}
                className="text-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= FORM ================= */}
      <div className="border rounded-xl p-5 space-y-3">
        <h3 className="font-medium text-sm">
          Tambah Skill
        </h3>

        <input
          type="text"
          placeholder="Contoh: JavaScript, Laravel, UI Design"
          value={nameSkill}
          onChange={(e) => setNameSkill(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

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
    </div>
  );
}
