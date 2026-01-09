import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../components/JobCard";
import JobDetailModal from "../../components/JobDetailModal";
import AdminAumLayout from "../../components/layout/AdminAumLayout";
const ListLowongan = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin-aum/jobs/", {
            headers : {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
          }

        );

        console.log(res.data.data)
        setJobs(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
    <AdminAumLayout>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onSelect={setSelectedJob}
          />
        ))}
      </div>
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </AdminAumLayout>
    </>
  );
};

export default ListLowongan;
