import { useEffect, useState} from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import { useNavigate } from "react-router-dom";
import PublicJobCard from "../components/users/PublicJobCard";


const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/public/jobs"
        );

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
         <PublicJobCard
            key={job._id}
            job={job}
            onClick={() => navigate(`/jobs/${job._id}`)}
          />
        ))}
      </div>
    </>
  );
};

export default JobList;
