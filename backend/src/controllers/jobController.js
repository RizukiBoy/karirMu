const { client } = require("../config/database");
const { ObjectId } = require("mongodb");

const { JOB_TYPE_VALUES } = require("../constants/jobTypeEnum");
const { WORK_TYPE_VALUES } = require("../constants/workTypeEnum");
const { JOB_STATUS_ENUM } = require("../constants/jobStatusEnum");

const users = client.db("karirMu").collection("users");
const jobs = client.db("karirMu").collection("jobs");
const companies = client.db("karirMu").collection("companies");
const jobFields = client.db("karirMu").collection("job_fields")
const apply_jobs = client.db("karirMu").collection("apply_jobs")
const user_documents = client.db("karirMu").collection("user_documents");
const saved_jobs = client.db("karirMu").collection("saved_jobs");


exports.createJobs = async (req, res) => {
    try {
      // =======================
      // 1️⃣ Validasi user
      // =======================
      const userId = req.user.userId;

      if (!ObjectId.isValid(userId)) {
        return res.status(401).json({ message: "User tidak valid" });
      }

      const userObjectId = new ObjectId(userId);

      // =======================
      // 2️⃣ Ambil user & company
      // =======================
      const user = await users.findOne(
        { _id: userObjectId },
        { projection: { company_id: 1 } }
      );

      if (!user?.company_id) {
        return res.status(403).json({
          message: "User belum terhubung dengan company",
        });
      }

      const companyObjectId = new ObjectId(user.company_id);

      const company = await companies.findOne({ _id: companyObjectId });
      if (!company) {
        return res.status(404).json({
          message: "Company tidak ditemukan",
        });
      }

      // =======================
      // 3️⃣ Ambil body
      // =======================
      const {
        job_field_id,
        job_name,
        location,
        address,
        type,
        work_type,
        salary_min,
        salary_max,
        description,
        requirement,
        date_job,
        status,
      } = req.body;

      // =======================
      // 4️⃣ Validasi wajib
      // =======================
      if (
        !job_field_id ||
        !job_name ||
        !location ||
        !type ||
        !work_type ||
        !description ||
        !requirement
      ) {
        return res.status(400).json({
          message: "Field wajib tidak boleh kosong",
        });
      }

      // =======================
      // 5️⃣ Validasi job field
      // =======================
      if (!ObjectId.isValid(job_field_id)) {
        return res.status(400).json({
          message: "Job field tidak valid",
        });
      }

      const jobFieldObjectId = new ObjectId(job_field_id);

      const jobField = await jobFields.findOne({
        _id: jobFieldObjectId,
      });

      if (!jobField) {
        return res.status(400).json({
          message: "Job field tidak ditemukan",
        });
      }

      // =======================
      // 6️⃣ Validasi salary
      // =======================
      if (
        salary_min !== undefined &&
        salary_max !== undefined &&
        Number(salary_min) > Number(salary_max)
      ) {
        return res.status(400).json({
          message: "salary_min tidak boleh lebih besar dari salary_max",
        });
      }

      // =======================
      // 7️⃣ Validasi date
      // =======================
      const parsedDate = date_job ? new Date(date_job) : new Date();
      if (isNaN(parsedDate)) {
        return res.status(400).json({
          message: "Format date_job tidak valid",
        });
      }

      // =======================
      // 8️⃣ Simpan job
      // =======================
      const newJob = {
        company_id: companyObjectId,
        job_field_id: jobFieldObjectId,
        job_name: job_name.trim(),
        location: location.trim(),
        address,
        type,
        work_type,
        salary_min: salary_min !== undefined ? Number(salary_min) : null,
        salary_max: salary_max !== undefined ? Number(salary_max) : null,
        description,
        requirement,
        date_job: parsedDate,
        status: typeof status === "boolean" ? status : true,
        created_by: userObjectId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await jobs.insertOne(newJob);

      return res.status(201).json({
        message: "Lowongan berhasil dibuat",
        data: newJob,
      });
    } catch (error) {
      console.error("ERROR createJobs:", error);
      return res.status(500).json({
        message: "Gagal membuat lowongan",
        error: error.message,
      });
    }
};

exports.getPublicJobs = async (req, res) => {
  try {
    const {
      search,
      job_field,
      location,
      type,
      work_type,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // =======================
    // FILTER DASAR
    // =======================
    const filter = {
      status: true, // hanya job aktif
    };

    // =======================
    // FILTER DINAMIS
    // =======================
    if (job_field) {
      filter.job_field = job_field; // ObjectId string
    }

    if (location) {
      filter.location = new RegExp(location, "i");
    }

    if (type) {
      filter.type = type;
    }

    if (work_type) {
      filter.work_type = work_type;
    }

    if (search) {
      filter.$or = [
        { job_name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { requirement: new RegExp(search, "i") },
      ];
    }

    // =======================
    // AGGREGATION PIPELINE
    // =======================
    const pipeline = [
      { $match: filter },

      // JOIN COMPANY
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      // JOIN JOB FIELD
      {
        $lookup: {
          from: "job_fields",
          localField: "job_field_id",
          foreignField: "_id",
          as: "job_field",
        },
      },
      {
        $unwind: {
          path: "$job_field",
          preserveNullAndEmptyArrays: true,
        },
      },

      // RESPONSE SHAPE
      {
        $project: {
          job_name: 1,
          location: 1,
          type: 1,
          work_type: 1,
          salary_min: 1,
          salary_max: 1,
          description: 1,
          requirement: 1,
          created_at: 1,

          company: {
            _id: "$company._id",
            company_name: "$company.company_name",
            logo_url: "$company.logo_url",
          },

          job_field: {
            _id: "$job_field._id",
            name: "$job_field.name",
          },
        },
      },

      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limitNum },
    ];

    const data = await jobs.aggregate(pipeline).toArray();
    const total = await jobs.countDocuments(filter);

    return res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      total_pages: Math.ceil(total / limitNum),
      data,
    });
  } catch (error) {
    console.error("ERROR getPublicJobs:", error);
    return res.status(500).json({
      message: "Gagal mengambil data lowongan",
    });
  }
};


exports.getPublicJobDetail = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Job ID tidak valid" });
    }

    const pipeline = [
      {
        $match: {
          _id: new ObjectId(jobId),
          status: true,
        },
      },

      // JOIN COMPANY
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      // JOIN JOB FIELD
      {
        $lookup: {
          from: "job_fields",
          localField: "job_field_id",
          foreignField: "_id",
          as: "job_field",
        },
      },
      {
        $unwind: {
          path: "$job_field",
          preserveNullAndEmptyArrays: true,
        },
      },

      // RESPONSE SHAPE
      {
        $project: {
          job_name: 1,
          location: 1,
          type: 1,
          date_job: 1,
          work_type: 1,
          salary_min: 1,
          salary_max: 1,
          description: 1,
          requirement: 1,
          created_at: 1,

          company: {
            _id: "$company._id",
            company_name: "$company.company_name",
            logo_url: "$company.logo_url",
          },

          job_field: {
            _id: "$job_field._id",
            name: "$job_field.name",
          },
        },
      },
    ];

    const data = await jobs.aggregate(pipeline).toArray();

    if (!data.length) {
      return res.status(404).json({ message: "Lowongan tidak ditemukan" });
    }

    return res.status(200).json({
      data: data[0], // ⬅️ sekarang OBJECT, bukan ARRAY
    });
  } catch (error) {
    console.error("ERROR getPublicJobDetail:", error);
    return res.status(500).json({
      message: "Gagal mengambil detail lowongan",
    });
  }
};


// exports.getJobsByCompany = async (req, res) => {
//   try {
//     // =======================
//     // 1️⃣ Ambil userId dari token
//     // =======================
//     const userId = req.user.userId;

//     if (!ObjectId.isValid(userId)) {
//       return res.status(401).json({ message: "User tidak valid" });
//     }

//     const userObjectId = new ObjectId(userId);

//     // =======================
//     // 2️⃣ Ambil user & company_id
//     // =======================
//     const user = await users.findOne(
//       { _id: userObjectId },
//       { projection: { company_id: 1 } }
//     );

//     if (!user?.company_id) {
//       return res.status(403).json({
//         message: "User belum terhubung dengan company",
//       });
//     }

//     const companyObjectId = new ObjectId(user.company_id);

//     // =======================
//     // 3️⃣ Query params
//     // =======================
//     const { status, search, page = 1, limit = 10 } = req.query;

//     const pageNum = Number(page);
//     const limitNum = Number(limit);
//     const skip = (pageNum - 1) * limitNum;

//     // =======================
//     // 4️⃣ Filter
//     // =======================
//     const filter = {
//       company_id: companyObjectId,
//     };

//     if (status === "true" || status === "false") {
//       filter.status = status === "true";
//     }

//     if (search) {
//       filter.$or = [
//         { job_name: new RegExp(search, "i") },
//         { description: new RegExp(search, "i") },
//       ];
//     }

//     // =======================
//     // 5️⃣ Query jobs
//     // =======================
//     const jobsData = await jobs
//       .find(filter)
//       .sort({ created_at: -1 })
//       .skip(skip)
//       .limit(limitNum)
//       .toArray();

//     const total = await jobs.countDocuments(filter);

//     // =======================
//     // 6️⃣ Response
//     // =======================
//     return res.json({
//       page: pageNum,
//       limit: limitNum,
//       total,
//       total_pages: Math.ceil(total / limitNum),
//       data: jobsData,
//     });
//   } catch (error) {
//     console.error("ERROR getJobsByCompany:", error);
//     return res.status(500).json({
//       message: "Gagal mengambil lowongan company",
//       error: error.message,
//     });
//   }
// };

// exports.getJobDetail = async (req, res) => {
//   try {
//     const { jobId } = req.params;

//     if (!ObjectId.isValid(jobId)) {
//       return res.status(400).json({ message: "Job ID tidak valid" });
//     }

//     const jobObjectId = new ObjectId(jobId);

//     const job = await jobs.aggregate([
//       { $match: { _id: jobObjectId } },

//       {
//         $addFields: {
//           job_field_id: {
//             $cond: [
//               { $eq: [{ $type: "$job_field_id" }, "string"] },
//               { $toObjectId: "$job_field_id" },
//               "$job_field_id"
//             ]
//           },
//           company_id: {
//             $cond: [
//               { $eq: [{ $type: "$company_id" }, "string"] },
//               { $toObjectId: "$company_id" },
//               "$company_id"
//             ]
//           }
//         }
//       },

//       {
//         $lookup: {
//           from: "job_fields",
//           localField: "job_field_id",
//           foreignField: "_id",
//           as: "job_field",
//         },
//       },
//       { $unwind: { path: "$job_field", preserveNullAndEmptyArrays: true } },

//       {
//         $lookup: {
//           from: "companies",
//           localField: "company_id",
//           foreignField: "_id",
//           as: "company",
//         },
//       },
//       { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           job_name: 1,
//           location: 1,
//           type: 1,
//           description: 1,
//           work_type: 1,
//           salary_min: 1,
//           salary_max: 1,
//           requirement: 1,
//           date_job: 1,
//           status: 1,
//           created_at: 1,
//           job_field: {
//             _id: "$job_field._id",
//             name: "$job_field.name",
//           },
//           company: {
//             _id: "$company._id",
//             company_name: "$company.company_name",
//             logo_url: "$company.logo_url",
//             city: "$company.city",
//             province: "$company.province",
//             industry: "$company.industry",
//           },
//         },
//       },
//     ]).next();

//     if (!job) {
//       return res.status(404).json({ message: "Lowongan tidak ditemukan" });
//     }

//     return res.json({
//       message: "Detail lowongan",
//       data: job,
//     });
//   } catch (error) {
//     console.error("ERROR getJobDetail:", error);
//     return res.status(500).json({
//       message: "Gagal mengambil detail lowongan",
//     });
//   }
// };
exports.getJobsByCompany = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { company_id: 1 } }
    );

    if (!user?.company_id) {
      return res.status(403).json({ message: "User belum terhubung dengan company" });
    }

    const companyId = new ObjectId(user.company_id);

    // =======================
    // 1️⃣ Hitung total lamaran per job
    // =======================
    const pipelinePerJob = [
      { $match: { company_id: companyId } },
        {
    $lookup: {
      from: "job_fields",
      localField: "job_field_id",
      foreignField: "_id",
      as: "job_field",
    },
  },
      { $unwind: { path: "$job_field", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "apply_jobs",
          localField: "_id",
          foreignField: "job_id",
          as: "applications",
        },
      },
      {
        $addFields: {
          total_applicants: { $size: "$applications" },
          submitted: {
            $size: {
              $filter: {
                input: "$applications",
                cond: { $eq: ["$$this.apply_status", "submitted"] },
              },
            },
          },
          accepted: {
            $size: {
              $filter: {
                input: "$applications",
                cond: { $eq: ["$$this.apply_status", "accepted"] },
              },
            },
          },
        },
      },
      {
        $project: {
          job_name: 1,
          location: 1,
          type: 1,
          date_job: 1,
          status: 1,
          job_field_name : "$job_field.name",
          total_applicants: 1,
          submitted: 1,
          accepted: 1,
        },
      },
    ];

    const jobsStats = await jobs.aggregate(pipelinePerJob).toArray();

    // =======================
    // 2️⃣ Hitung total lamaran company
    // =======================
    const totalPipeline = [
      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: { "job.company_id": companyId } },
      {
        $group: {
          _id: null,
          total_applicants: { $sum: 1 },
          submitted: {
            $sum: { $cond: [{ $eq: ["$apply_status", "submitted"] }, 1, 0] },
          },
          accepted: {
            $sum: { $cond: [{ $eq: ["$apply_status", "accepted"] }, 1, 0] },
          },
        },
      },
    ];

    const totalStatsResult = await apply_jobs.aggregate(totalPipeline).toArray();
    const totalStats = totalStatsResult[0] || { total_applicants: 0, submitted: 0, accepted: 0 };

    return res.json({
      jobs: jobsStats,
      total: totalStats,
    });

  } catch (err) {
    console.error("ERROR getJobsStatsForCompany:", err);
    return res.status(500).json({
      message: "Gagal mengambil statistik lamaran",
      error: err.message,
    });
  }
};

exports.getJobDetail = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Job ID tidak valid" });
    }

    const jobObjectId = new ObjectId(jobId);

 const job = await jobs.aggregate([
  { $match: { _id: jobObjectId } },

{
  $addFields: {
    job_field_id: {
      $cond: [
        {
          $and: [
            { $eq: [{ $type: "$job_field_id" }, "string"] },
            { $ne: ["$job_field_id", ""] },
          ],
        },
        { $toObjectId: "$job_field_id" },
        "$job_field_id",
      ],
    },
    company_id: {
      $cond: [
        {
          $and: [
            { $eq: [{ $type: "$company_id" }, "string"] },
            { $ne: ["$company_id", ""] },
          ],
        },
        { $toObjectId: "$company_id" },
        "$company_id",
      ],
    },
  },
},


  {
    $lookup: {
      from: "job_fields",
      localField: "job_field_id",
      foreignField: "_id",
      as: "job_field",
    },
  },
  { $unwind: { path: "$job_field", preserveNullAndEmptyArrays: true } },

  {
    $lookup: {
      from: "companies",
      localField: "company_id",
      foreignField: "_id",
      as: "company",
    },
  },
  { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

  {
    $project: {
      job_name: 1,
      location: 1,
      type: 1,
      work_type: 1,
      description: 1,
      salary_min: 1,
      salary_max: 1,
      requirement: 1,
      created_at: 1,
      status: 1,
      job_field: {
        _id: "$job_field._id",
        name: "$job_field.name",
      },
      company: {
        _id: "$company._id",
        company_name: "$company.company_name",
        logo_url: "$company.logo_url",
        city: "$company.city",
        province: "$company.province",
      },
    },
  },
]).next();


    if (!job) {
      return res.status(404).json({ message: "Lowongan tidak ditemukan" });
    }

    return res.json({
      message: "Detail lowongan",
      data: job,
    });
  } catch (error) {
    console.error("ERROR getJobDetail:", error);
    return res.status(500).json({
      message: "Gagal mengambil detail lowongan",
    });
  }
};

exports.updateJobAdminAUM = async (req, res) => {
  try {
    // =======================
    // 1️⃣ Authorization
    // =======================
    if (req.user.role !== "company_hrd") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    // =======================
    // 2️⃣ Validate jobId
    // =======================
    const { jobId } = req.params;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Job ID tidak valid" });
    }

    const jobObjectId = new ObjectId(jobId);

    // =======================
    // 3️⃣ Pastikan job ada
    // =======================
    const job = await jobs.findOne({ _id: jobObjectId });
    if (!job) {
      return res.status(404).json({ message: "Lowongan tidak ditemukan" });
    }

    // =======================
    // 4️⃣ Build update data
    // =======================
    const updateData = {};

    const allowedFields = [
      "job_name",
      "job_field_id",
      "location",
      "address",
      "type",
      "work_type",
      "description",   // ✅ KEMBALI
      "requirement",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // =======================
    // 5️⃣ job_field_id validation
    // =======================
    if (updateData.job_field_id) {
      if (!ObjectId.isValid(updateData.job_field_id)) {
        return res.status(400).json({
          message: "job_field_id tidak valid",
        });
      }

      const jobField = await jobFields.findOne({
        _id: new ObjectId(updateData.job_field_id),
      });

      if (!jobField) {
        return res.status(404).json({
          message: "Job field tidak ditemukan",
        });
      }

      updateData.job_field_id = new ObjectId(updateData.job_field_id);
    }

    // =======================
    // 6️⃣ Salary validation
    // =======================
    if (req.body.salary_min !== undefined) {
      updateData.salary_min = Number(req.body.salary_min);
    }

    if (req.body.salary_max !== undefined) {
      updateData.salary_max = Number(req.body.salary_max);
    }

    if (
      updateData.salary_min !== undefined &&
      updateData.salary_max !== undefined &&
      updateData.salary_min > updateData.salary_max
    ) {
      return res.status(400).json({
        message: "salary_min tidak boleh lebih besar dari salary_max",
      });
    }

    // =======================
    // 7️⃣ date_job validation
    // =======================
    if (req.body.date_job !== undefined) {
      const parsedDate = new Date(req.body.date_job);
      if (isNaN(parsedDate)) {
        return res.status(400).json({
          message: "Format date_job tidak valid",
        });
      }
      updateData.date_job = parsedDate;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Tidak ada data yang diperbarui",
      });
    }

    // =======================
    // 8️⃣ Update DB
    // =======================
    updateData.updated_at = new Date();

    await jobs.updateOne(
      { _id: jobObjectId },
      { $set: updateData }
    );

    // =======================
    // 9️⃣ Response
    // =======================
    return res.json({
      message: "Lowongan berhasil diperbarui",
      data: updateData,
    });
  } catch (error) {
    console.error("ERROR updateJobAdminAUM:", error);
    return res.status(500).json({
      message: "Gagal memperbarui lowongan",
      error: error.message,
    });
  }
};

exports.updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    // 1️⃣ Validasi ObjectId
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Job ID tidak valid" });
    }

    // 2️⃣ Validasi status (WAJIB boolean)
    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status harus berupa boolean (true / false)",
      });
    }

    const jobObjectId = new ObjectId(jobId);

    // 3️⃣ Update status
    const result = await jobs.updateOne(
      { _id: jobObjectId },
      {
        $set: {
          status,
          updated_at: new Date(),
        },
      }
    );

    // 4️⃣ Jika job tidak ditemukan
    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Lowongan tidak ditemukan",
      });
    }

    return res.json({
      message: status
        ? "Lowongan berhasil diaktifkan"
        : "Lowongan berhasil dinonaktifkan",
    });
  } catch (error) {
    console.error("ERROR updateJobStatus:", error);
    return res.status(500).json({
      message: "Gagal memperbarui status lowongan",
    });
  }
};


exports.applyJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    // =======================
    // 1️⃣ Validasi jobId
    // =======================
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Job ID tidak valid" });
    }

    // =======================
    // 2️⃣ Ambil CV dari user_documents
    // =======================
    const userDocument = await user_documents.findOne({
      user_id: new ObjectId(userId),
    });

    if (!userDocument || !userDocument.resume_cv) {
      return res.status(400).json({
        message: "Anda harus mengunggah CV sebelum melamar pekerjaan",
      });
    }

    // =======================
    // 3️⃣ Cek sudah pernah apply?
    // =======================
    const existingApply = await apply_jobs.findOne({
      user_id: new ObjectId(userId),
      job_id: new ObjectId(jobId),
    });

    if (existingApply) {
      return res.status(409).json({
        message: "Anda sudah melamar lowongan ini",
      });
    }

    // =======================
    // 4️⃣ Simpan lamaran
    // =======================
    const payload = {
      user_id: new ObjectId(userId),
      job_id: new ObjectId(jobId),
      cv_url: userDocument.resume_cv,
      apply_status: "submitted",
      apply_date: new Date(),
      updated_at: new Date(),
      hrd_notes: null,
    };

    await apply_jobs.insertOne(payload);

    return res.status(201).json({
      message: "Lamaran berhasil dikirim",
    });
  } catch (error) {
    console.error("ERROR applyJob:", error);
    return res.status(500).json({
      message: "Gagal melamar pekerjaan",
    });
  }
};

exports.getApplyJobsForCompany = async (req, res) => {
  try {
    // =======================
    // 1️⃣ VALIDASI USER
    // =======================
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, role } = req.user;

    if (role !== "company_hrd") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { company_id: 1 } }
    );

    if (!user || !user.company_id) {
      return res.status(403).json({ message: "Company tidak ditemukan" });
    }

    const companyId = user.company_id;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 5));
    const skip = (page -1) * limit;

    // =======================
    // 2️⃣ AGGREGATION (BENAR)
    // =======================
      const pipeline = [
      // join ke jobs
      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      // filter by company
      {
        $match: {
          "job.company_id": companyId,
        },
      },

      // join ke users (pelamar)
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "applicant",
        },
      },
      { $unwind: "$applicant" },
      ]

      const countPipeline = [
        ...pipeline,
        { $count: "total" },
      ];

      const countResult = await apply_jobs.aggregate(countPipeline).toArray();

      const total = countResult[0]?.total || 0;
      const totalPage = Math.ceil(total / limit);

      const dataPipeline = [
        ...pipeline,
          { $sort: { apply_date: -1 } },
          { $skip: skip },
          { $limit: limit },

          {
            $project: {
              apply_status: 1,
              apply_date: 1,
              updated_at: 1,
              cv_url: 1,
              hrd_notes: 1,

              "job._id": 1,
              "job.job_name": 1,
              "job.location": 1,
              "job.type": 1,
              "job.work_type": 1,

              "applicant._id": 1,
              "applicant.email": 1,
              "applicant.full_name": 1,
            },
          },
    ];

    const applications = await apply_jobs.aggregate(dataPipeline).toArray();

    return res.json({
      data: applications,
      total,
      page,
      limit,
      totalPage,
    });
  } catch (error) {
    console.error("ERROR getApplyJobsForCompany:", error);
    return res.status(500).json({
      message: "Gagal mengambil data lamaran",
    });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { job_id } = req.body;

    await saved_jobs.insertOne({
      user_id: new ObjectId(userId),
      job_id: new ObjectId(job_id),
      saved_at: new Date(),
    });

    res.json({ message: "Job berhasil disimpan" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Job sudah disimpan" });
    }

    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan job" });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    await saved_jobs.deleteOne({
      user_id: new ObjectId(userId),
      job_id: new ObjectId(jobId),
    });

    res.json({ message: "Job dihapus dari simpanan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus simpanan" });
  }
};

exports.getSavedJobsForUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await saved_jobs.aggregate([
      { $match: { user_id: new ObjectId(userId) } },

      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      {
        $lookup: {
          from: "companies",
          localField: "job.company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      {
        $project: {
          _id: 1,
          saved_at: 1,
          "job._id": 1,
          "job.job_name": 1,
          "job.location": 1,
          "job.type": 1,
          "job.work_type": 1,
          "job.salary_min": 1,
          "job.salary_max": 1,
          "company.company_name": 1,
        },
      },
      { $sort: { saved_at: -1 } },
    ]).toArray();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil job tersimpan" });
  }
};

exports.checkSavedJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    const exist = await saved_jobs.findOne({
      user_id: new ObjectId(userId),
      job_id: new ObjectId(jobId),
    });

    res.json({ saved: !!exist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal cek saved job" });
  }
};





