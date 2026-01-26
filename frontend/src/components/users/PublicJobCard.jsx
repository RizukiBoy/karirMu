import { useNavigate } from "react-router-dom";
import { Check, Location, Profile, Save2 } from "iconsax-reactjs";
import SaveJobButton from "../SaveJobButton";

const PublicJobCard = ({ job }) => {
  const navigate = useNavigate();

  const getDetail = () => {
    navigate(`/jobs/${job._id || job.id || ""}`, {
      state: { job },
    });
  };
  const JOB_TYPE_LABEL = {
  full_time: "Penuh Waktu",
  part_time: "Paruh Waktu",
  internship: "Magang",
  contract: "Kontrak",
  freelance: "Freelance",
};

const WORK_TYPE_LABEL = {
  onsite: "Di Kantor",
  remote: "Remote",
  hybrid: "Fleksibel",
};

const formatJobType = (type) => {
  return JOB_TYPE_LABEL[type] ?? type;
};

const formatWorkType = (type) => {
  return WORK_TYPE_LABEL[type] ?? type;
};

const formatCurrency = (value) => {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID").format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "Baru saja";

  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

  return (
    <div
      onClick={getDetail}
      className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition"
    >
      <div className="space-y-5 flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-semibold">
            {job.job_name}
          </h4>
          {job.salary_min && job.salary_max && (
            <span className="text-sm font-medium">
              Rp {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
            </span>
          )}
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-3">
          {job.job_field?.name && (
            <span className="px-4 py-1.5 bg-[#409144]/15 text-[#409144] text-xs font-medium rounded-full">
              {job.job_field.name}
            </span>
          )}
          {job.type && (
            <span className="px-4 py-1.5 bg-[#409144]/15 text-[#409144] text-xs font-medium rounded-full">
              {formatJobType(job.type)}
            </span>
          )}
          {job.work_type && (
            <span className="px-4 py-1.5 bg-[#409144]/15 text-[#409144] text-xs font-medium rounded-full">
              {formatWorkType(job.work_type)}
            </span>
          )}
        </div>

        {/* LOGO + INFO */}
        <div className="flex gap-5">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center ring-1 ring-black/30 ring-offset-1 ring-offset-white shrink-0">
              {job?.logo ? (
                <img
                  src={job.logo}
                  alt="Company"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
                  <Profile color="#555" variant="Bold" />
                </div>
              )}
            </div>
            <div className="border-l border-gray-300 h-14" />
          </div>

          <div className="space-y-1">
            {/* NAMA PERUSAHAAN */}
            <div className="flex items-center gap-2 font-medium">
              <Check className="w-5 h-5" />
              <span>{job.company?.company_name || "-"}</span>
            </div>

            {/* LOKASI */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Location className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center pt-5">
        <span className="text-xs text-gray-500">
          {formatDate(job.created_at) || "Baru saja"}
        </span>

        <div className="flex items-center gap-3">
          <SaveJobButton jobId={job._id} />

          <button
            onClick={(e) => {
              e.stopPropagation();
              getDetail();
            }}
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
      </div>
    </div>
  );
};

export default PublicJobCard;
