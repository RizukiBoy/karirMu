import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserDocumentSection from "../../components/users/userDocumentSection";
import EducationSection from "../../components/users/EducationSection";
import UserSkills from "../../components/users/UserSkill";
import WorkExperience from "../../components/users/WorkExperience";


export default function ProfileDetail() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Memuat profil...</p>;
  }

  if(!profile) {
    navigate("/user/add-profile")
  }
  
  return (
    <>
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profile?.photo || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <h1 className="text-2xl font-semibold">{profile?.headline}</h1>
          <p className="text-gray-500">{profile?.location}</p>
        </div>
      </div>

      {/* About */}
      <section className="mb-6">
        <h2 className="font-semibold mb-1">Tentang Saya</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {profile?.about_me || "-"}
        </p>
      </section>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Info label="Alamat" value={profile?.address} />
        <Info label="Umur" value={profile?.age ? `${profile?.age} tahun` : "-"} />
        <Info
          label="Gender"
          value={
            profile?.gender === "male"
              ? "Laki-laki"
              : profile?.gender === "female"
              ? "Perempuan"
              : "-"
          }
        />
        <Info label="WhatsApp" value={profile?.whatsapp} />
      </div>

      {/* Action */}
      <div className="mt-8">
        <button
          onClick={() => navigate("/profile/edit")}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Edit Profil
        </button>
      </div>
      <UserDocumentSection />
      <EducationSection />
      <UserSkills />
      <WorkExperience />
    </div>

    </>
  );
}

/* ===== Reusable Info Row ===== */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
