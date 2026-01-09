const { client } = require("../config/database");
const { ObjectId } = require("mongodb");

const { JOB_TYPE_VALUES } = require("../constants/jobTypeEnum");
const { WORK_TYPE_VALUES } = require("../constants/workTypeEnum");
const { JOB_STATUS_ENUM } = require("../constants/jobStatusEnum");

const users = client.db("karirMu").collection("users");
const jobs = client.db("karirMu").collection("jobs");

const companies = client
    .db("karirMu")
    .collection("companies");

exports.createJobs = async (req, res) => {
  try {
    // =======================
    // 1️⃣ Ambil & validasi userId
    // =======================
    const userId = req.user.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const userObjectId = new ObjectId(userId);

    // =======================
    // 2️⃣ Ambil user dari DB
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

    // =======================
    // 3️⃣ Pastikan company ada
    // =======================
    const company = await companies.findOne({ _id: companyObjectId });
    if (!company) {
      return res.status(404).json({
        message: "Company tidak ditemukan",
      });
    }

    // =======================
    // 4️⃣ Ambil body
    // =======================
    const {
      category,
      job_name,
      location,
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
    // 5️⃣ Validasi wajib
    // =======================
    if (
      !category ||
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
    // 6️⃣ Validasi ENUM
    // =======================
    if (!JOB_TYPE_VALUES.includes(type)) {
      return res.status(400).json({
        message: "Job type tidak valid",
      });
    }

    if (!WORK_TYPE_VALUES.includes(work_type)) {
      return res.status(400).json({
        message: "Work type tidak valid",
      });
    }

    // =======================
    // 7️⃣ Validasi salary
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
    // 8️⃣ Validasi date
    // =======================
    const parsedDate = date_job ? new Date(date_job) : new Date();
    if (isNaN(parsedDate)) {
      return res.status(400).json({
        message: "Format date_job tidak valid",
      });
    }

    console.log("BODY:", req.body);


    // =======================
    // 9️⃣ Siapkan data job
    // =======================
    const newJob = {
      company_id: companyObjectId,
      category: String(category).trim(),
      job_name: String(job_name).trim(),
      location: String(location).trim(),
      type,
      work_type,
      salary_min:
        salary_min !== undefined ? Number(salary_min) : null,
      salary_max:
        salary_max !== undefined ? Number(salary_max) : null,
      description,
      requirement,
      date_job: parsedDate,
      status:
        typeof status === "boolean"
          ? status
          : JOB_STATUS_ENUM.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: userObjectId,
    };

    // =======================
    // 🔟 Insert ke DB
    // =======================
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
      category,
      location,
      type,
      work_type,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    // =======================
    // FILTER DASAR
    // =======================
    const filter = {
      status: true, // konsisten dengan createJobs (job aktif)
    };

    // =======================
    // FILTER DINAMIS
    // =======================
    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
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

    const skip = (pageNum - 1) * limitNum;

    // =======================
    // AGGREGATION
    // =======================
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          job_name: 1,
          category: 1,
          location: 1,
          type: 1,
          work_type: 1,
          salary_min: 1,
          salary_max: 1,
          description: 1,
          requirement: 1,
          date_job: 1,
          created_at: 1,
          "company._id": 1,
          "company.company_name": 1,
          "company.logo_url": 1,
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limitNum },
    ];

    const jobsData = await jobs.aggregate(pipeline).toArray();
    const total = await jobs.countDocuments(filter);

    return res.json({
      page: pageNum,
      limit: limitNum,
      total,
      total_pages: Math.ceil(total / limitNum),
      data: jobsData,
    });
  } catch (error) {
    console.error("ERROR getPublicJobs:", error);
    return res.status(500).json({
      message: "Gagal mengambil data lowongan",
      error: error.message,
    });
  }
};

exports.getJobsByCompany = async (req, res) => {
  try {
    // =======================
    // 1️⃣ Ambil userId dari token
    // =======================
    const userId = req.user.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const userObjectId = new ObjectId(userId);

    // =======================
    // 2️⃣ Ambil user & company_id
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

    // =======================
    // 3️⃣ Query params
    // =======================
    const { status, search, page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // =======================
    // 4️⃣ Filter
    // =======================
    const filter = {
      company_id: companyObjectId,
    };

    if (status === "true" || status === "false") {
      filter.status = status === "true";
    }

    if (search) {
      filter.$or = [
        { job_name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    // =======================
    // 5️⃣ Query jobs
    // =======================
    const jobsData = await jobs
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const total = await jobs.countDocuments(filter);

    // =======================
    // 6️⃣ Response
    // =======================
    return res.json({
      page: pageNum,
      limit: limitNum,
      total,
      total_pages: Math.ceil(total / limitNum),
      data: jobsData,
    });
  } catch (error) {
    console.error("ERROR getJobsByCompany:", error);
    return res.status(500).json({
      message: "Gagal mengambil lowongan company",
      error: error.message,
    });
  }
};

exports.getJobDetail = async (req, res) => {
  try {
    // =======================
    // 1️⃣ Ambil jobId dari params
    // =======================
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Job ID tidak valid",
      });
    }

    const jobId = new ObjectId(id);

    // =======================
    // 2️⃣ Ambil job
    // =======================
    const job = await jobs.findOne({ _id: jobId });

    if (!job) {
      return res.status(404).json({
        message: "Lowongan tidak ditemukan",
      });
    }

    // =======================
    // 3️⃣ Jika job nonaktif → public tidak boleh lihat
    // =======================
    if (
      job.status === false &&
      (!req.user || req.user.company_id !== job.company_id.toString())
    ) {
      return res.status(403).json({
        message: "Lowongan sudah tidak aktif",
      });
    }

    // =======================
    // 4️⃣ Ambil company
    // =======================
    const company = await companies.findOne(
      { _id: job.company_id },
      {
        projection: {
          company_name: 1,
          logo_url: 1,
          city: 1,
          province: 1,
          industry: 1,
        },
      }
    );

    // =======================
    // 5️⃣ Response
    // =======================
    res.json({
      ...job,
      company,
    });
  } catch (error) {
    console.error("ERROR getJobDetail:", error);
    res.status(500).json({
      message: "Gagal mengambil detail lowongan",
      error: error.message,
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
      "category",
      "location",
      "type",
      "work_type",
      "description",
      "requirement",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.salary_min !== undefined) {
      updateData.salary_min = Number(req.body.salary_min);
    }

    if (req.body.salary_max !== undefined) {
      updateData.salary_max = Number(req.body.salary_max);
    }

    if (req.body.date_job !== undefined) {
      const parsedDate = new Date(req.body.date_job);
      if (isNaN(parsedDate)) {
        return res
          .status(400)
          .json({ message: "Format date_job tidak valid" });
      }
      updateData.date_job = parsedDate;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Tidak ada data yang diperbarui" });
    }

    // =======================
    // 5️⃣ Business validation
    // =======================
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
    // 6️⃣ Update DB
    // =======================
    updateData.updated_at = new Date();

    await jobs.updateOne(
      { _id: jobObjectId },
      { $set: updateData }
    );

    // =======================
    // 7️⃣ Response
    // =======================
    return res.json({
      message: "Lowongan berhasil diperbarui",
      data: updateData,
    });
  } catch (error) {
    console.error("ERROR updateJobAdminAUM:", error);
    return res.status(500).json({
      message: "Gagal memperbarui lowongan",
    });
  }
};

