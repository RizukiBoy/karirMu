import AddProfile from "../../components/users/Addprofile";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

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
        setIsEdit(true); // profile exists
      } catch (error) {
        if (error.response?.status === 404) {
          setIsEdit(false); // profile belum ada
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <AddProfile
        initialData={profile}
        isEdit={isEdit}
      />
    </div>
  );
}
