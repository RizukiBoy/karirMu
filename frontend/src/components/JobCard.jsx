 import { useNavigate } from "react-router-dom"
 
 const JOB_TYPE_LABEL = {
  full_time: "Penuh Waktu",
  part_time: "Paruh Waktu",
  internship: "Magang",
  contract: "Kontrak",
  freelance: "Freelance",
};

const formatJobType = (type) => {
  return JOB_TYPE_LABEL[type] ?? type;
};


const JobCard = ({ job, onClick }) => {
  const navigate = useNavigate();
  
  return (
//   <div className="overflow-x-auto md:overflow-visible">
//     <table className="w-full text-sm border-l border-r border-gray-200">
//       <tbody>
//           <tr onClick={onClick}
//             key={job._id}
//             className="border-b border-gray-200"
//           >
//             <td className="px-4 py-4 w-1/5">
//               <p className="font-semibold line-clamp-1">{job.job_name}</p>
//             </td>

//             <td className="px-4 py-4 w-1/5">
//               <p className="text-gray-800">{formatJobType(job.type)}</p>
//             </td>

//             <td className="px-4 py-4 w-1/5 truncate">
//               {job.date_job ? new Intl.DateTimeFormat("id-ID", {
//                 day : "2-digit",
//                 month: "long",
//                 year: "numeric"
//               }).format(new Date(job.date_job)): "-"}
//             </td>

//             <td className="px-4 py-4 w-1/5">
//               {job.status ? (
//                 <span className="px-3 py-1 text-xs rounded-full bg-green-600 text-white">
//                   Aktif
//                 </span>
//               ) : (
//                 <span className="w-fit px-3 py-1 text-xs rounded-full bg-red-500 text-white line-clamp-1">
//                   Non-Aktif
//                 </span>
//               )}
//             </td>

//             <td className="px-4 py-4 w-1/5">
// <button
//   onClick={() =>
//     navigate("/admin-aum/list-lowongan", {
//       state: { job },
//     })
//   }
//   className="
//     px-4 py-1.5
//     border border-green-600
//     text-green-600
//     rounded-full
//     text-xs
//     hover:bg-green-600
//     hover:text-white
//     transition
//   "
// >
//   Detail
// </button>

//             </td>
//           </tr>
//       </tbody>
//     </table>
//   </div>
    <div className="overflow-hidden md:overflow-visible">
      <table className="w-full text-sm border border-gray-200 rounded-lg md:rounded-none">
        <tbody>
          <tr
            onClick={onClick}
            className="
              border-b border-gray-200
              flex flex-col gap-3
              px-4 py-4
              md:table-row md:gap-0 md:px-0 md:py-0
              hover:bg-gray-50 cursor-pointer
            "
          >

            {/* ===== PEKERJAAN ===== */}
            <td className="md:px-4 md:py-4 md:w-1/5">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 md:hidden">
                  Pekerjaan
                </span>
                <p className="font-semibold line-clamp-2">
                  {job.job_name}
                </p>
              </div>
            </td>

            {/* ===== TIPE PEKERJAAN ===== */}
            <td className="md:px-4 md:py-4 md:w-1/5">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 md:hidden">
                  Tipe Pekerjaan
                </span>
                <p className="text-gray-800">
                  {formatJobType(job.type)}
                </p>
              </div>
            </td>

            {/* ===== TANGGAL ===== */}
            <td className="md:px-4 md:py-4 md:w-1/5">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 md:hidden">
                  Tanggal Dibuat
                </span>
                <p>
                  {job.date_job
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(job.date_job))
                    : "-"}
                </p>
              </div>
            </td>

            {/* ===== STATUS ===== */}
            <td className="md:px-4 md:py-4 md:w-1/5">
              <div className="flex items-center justify-between md:block">
                <span className="text-xs text-gray-500 md:hidden">
                  Status
                </span>

                {job.status ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-600 text-white">
                    Aktif
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-500 text-white">
                    Non-Aktif
                  </span>
                )}
              </div>
            </td>

            {/* ===== AKSI ===== */}
            <td className="md:px-4 md:py-4 md:w-1/5">
              <div className="flex justify-end md:justify-start">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/admin-aum/list-lowongan", {
                      state: { job },
                    });
                  }}
                  className="
                    px-5 py-2
                    border border-green-600
                    text-green-600
                    rounded-full
                    text-xs
                    hover:bg-green-600 hover:text-white
                    transition
                  "
                >
                  Detail
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default JobCard;
