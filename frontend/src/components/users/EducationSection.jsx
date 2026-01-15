import { useEffect, useState } from "react";
import axios from "axios";
import EducationForm from "./EducationForm";

export default function EducationSection() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEducations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/education",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setEducations(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data pendidikan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Memuat data pendidikan...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Pendidikan</h2>

      {/* LIST EDUCATION */}
      {educations.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada data pendidikan
        </p>
      ) : (
        <div className="space-y-3">
          {educations.map((edu, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 text-sm"
            >
              <p className="font-medium">
                {edu.study_level}
              </p>
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
      )}

      {/* FORM */}
      <EducationForm onSuccess={fetchEducations} />
    </div>
  );
}
