import { useEffect, useState } from "react";
import axios from "axios";
import PelamarLayout from "../../components/layout/PelamarLayout";
import PublicJobCard from "../../components/users/PublicJobCard";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setSavedJobs(res.data || []);
        console.log(res.data)
      } catch (err) {
        console.error("Gagal ambil saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  return (
    <PelamarLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div
          className="px-4 py-3 rounded-t-2xl font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
          }}
        >
          Lowongan Tersimpan
        </div>

        {/* CONTENT */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            Memuat...
          </div>
        )}

        {!loading && savedJobs.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            Belum ada lowongan yang disimpan
          </div>
        )}

        {!loading && savedJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((item) => (
              <PublicJobCard
                key={item._id}
                job={{
                  ...item.job,
                  company: item.job.company,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </PelamarLayout>
  );
};

export default SavedJobs;
