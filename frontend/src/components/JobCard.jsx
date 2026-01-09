const JobCard = ({ job, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
      <div>
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h2 className="font-semibold">{job.job_name}</h2>
            <p className="text-sm text-gray-500">
              {job.company?.company_name}
            </p>
          </div>
        </div>

        {/* INFO */}
        <p className="text-sm text-gray-600">📍 {job.location}</p>
        <p className="text-sm text-gray-600">💼 {job.type}</p>
        <p className="text-sm text-gray-600">🏷️ {job.category}</p>

        <p className="text-sm font-medium text-gray-800 mt-3">
          💰{" "}
          {job.salary_min && job.salary_max
            ? `Rp ${job.salary_min.toLocaleString()} - Rp ${job.salary_max.toLocaleString()}`
            : "Gaji dirahasiakan"}
        </p>
      </div>

      {/* ACTION */}
      <button
        onClick={() => onSelect(job)}
        className="mt-4 bg-emerald-600 text-white rounded-xl py-2 hover:bg-emerald-700 transition"
      >
        Lihat Detail
      </button>
    </div>
  );
};

export default JobCard;
