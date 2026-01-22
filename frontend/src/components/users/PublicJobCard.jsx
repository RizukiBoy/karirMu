import { useNavigate } from "react-router-dom";



const PublicJobCard = ({ job, onClick }) => {
    const navigate = useNavigate()
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-4 hover:shadow transition bg-white"
    >
      <h3 className="font-semibold text-lg">{job.job_name}</h3>

      <p className="text-sm text-gray-600 mt-1">
        {job.company?.company_name || "-"}
      </p>

      <div className="text-xs text-gray-500 mt-2 flex gap-3">
        <span>{job.location}</span>
        <span>{job.job_field?.name}</span>
        <span>{job.type}</span>
      </div>

      <button
  onClick={() =>
    navigate("/jobs/:jobId", {
      state: { job },
    })
  }
  className="
    px-4 py-1.5
    border border-green-600
    text-green-600
    rounded-full
    text-xs
    hover:bg-green-600
    hover:text-white
    transition
  "
>
  Detail
</button>
    </div>
  );
};

export default PublicJobCard;
