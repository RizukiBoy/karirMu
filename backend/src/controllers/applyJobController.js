const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const users = client.db("karirMu").collection("users");
const apply_jobs = client.db("karirMu").collection("apply_jobs");

exports.getApplicantDetailForCompany = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, role } = req.user;
    if (role !== "company_hrd") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const { applyId } = req.params;

    if (!ObjectId.isValid(applyId)) {
      return res.status(400).json({ message: "Apply ID tidak valid" });
    }

    // ambil company_id HRD
    const hrd = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { company_id: 1 } }
    );

    if (!hrd?.company_id) {
      return res.status(403).json({ message: "Company tidak ditemukan" });
    }

    const pipeline = [
      { $match: { _id: new ObjectId(applyId) } },

      // join job
      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      // pastikan job milik company HRD
      {
        $match: {
          "job.company_id": hrd.company_id,
        },
      },

      // join user (pelamar)
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "applicant",
        },
      },
      { $unwind: "$applicant" },

      // join profile (jika ada collection profile)
      {
        $lookup: {
          from: "user_profiles",
          localField: "user_id",
          foreignField: "user_id",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "user_educations",
          localField: "user_id",
          foreignField: "user_id",
          as: "educations",
        },
      },

      {
        $lookup: {
          from: "user_skills",
          localField: "user_id",
          foreignField: "user_id",
          as: "skills",
        },
      },

  // ===== JOIN WORK EXPERIENCE =====
      {
        $lookup: {
          from: "work_experience",
          localField: "user_id",
          foreignField: "user_id",
          as: "work_experiences",
        },
      },

      {
        $project: {
          apply_status: 1,
          apply_date: 1,
          cv_url: 1,
          hrd_notes: 1,

          "job.job_name": 1,

          "applicant._id": 1,
          "applicant.full_name": 1,
          "applicant.email": 1,

          "profile.headline": 1,
          "profile.about_me": 1,
          "profile.address": 1,
          "profile.whatsapp": 1,
          "profile.gender": 1,
          "profile.age": 1,

          educations: {
        _id: 1,
        study_level: 1,
        institution: 1,
        major: 1,
        graduate: 1,
      },

      // ===== SKILLS =====
      skills: {
        _id: 1,
        name_skill: 1,
      },

      // ===== WORK EXPERIENCES =====
      work_experiences: {
        _id: 1,
        company_name: 1,
        job_title: 1,
        start_date: 1,
        end_date: 1,
        description: 1,
      },
        },
      },
    ];

    const result = await apply_jobs.aggregate(pipeline).toArray();

    if (!result.length) {
      return res.status(404).json({ message: "Data pelamar tidak ditemukan" });
    }

    return res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil detail pelamar" });
  }
};

exports.getAppliedJobsForUser = async (req, res) => {
  try {
    const userId = req.user.userId; // dari JWT/session

    const data = await apply_jobs.aggregate([
      {
        $match: {
          user_id: new ObjectId(userId),
        },
      },

      // JOIN ke jobs
      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      // JOIN ke companies
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
          apply_status: 1,
          apply_date: 1,
          updated_at: 1,
          hrd_notes: 1,
          cv_url: 1,

          // field dari jobs
          "job._id": 1,
          "job.job_name": 1,
          "job.location": 1,
          "job.type": 1,
          "job.work_type": 1,
          "job.salary_min": 1,
          "job.salary_max": 1,
          "job.status": 1,

          // field dari company
          "company._id": 1,
          "company.company_name": 1,
          "company.logo_url": 1, // optional kalau ada
        },
      },
      {
        $sort: { apply_date: -1 }, // terbaru dulu
      },
    ]).toArray();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil data lamaran" });
  }
};



exports.updateApplication = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, role } = req.user;
    if (role !== "company_hrd") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const { applyId } = req.params;
    const { apply_status, hrd_notes } = req.body;

    const allowedStatus = [
      "submitted",
      "reviewed",
      "accepted",
      "rejected",
    ];

    const updateDoc = {
      updated_at: new Date(),
    };

    // validasi status jika dikirim
    if (apply_status) {
      if (!allowedStatus.includes(apply_status)) {
        return res.status(400).json({ message: "Status tidak valid" });
      }
      updateDoc.apply_status = apply_status;
    }

    // notes opsional
    if (typeof hrd_notes === "string") {
      updateDoc.hrd_notes = hrd_notes.trim();
    }

    // ambil company HRD
    const hrd = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { company_id: 1 } }
    );

    if (!hrd?.company_id) {
      return res.status(403).json({ message: "Company tidak ditemukan" });
    }

    // pastikan apply milik company HRD
    const application = await apply_jobs.aggregate([
      { $match: { _id: new ObjectId(applyId) } },
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
        $match: {
          "job.company_id": hrd.company_id,
        },
      },
    ]).toArray();

    if (!application.length) {
      return res.status(404).json({ message: "Lamaran tidak ditemukan" });
    }

    await apply_jobs.updateOne(
      { _id: new ObjectId(applyId) },
      { $set: updateDoc }
    );

    return res.json({
      message: "Lamaran berhasil diperbarui",
      data: updateDoc,
    });
  } catch (error) {
    console.error("ERROR updateApplication:", error);
    return res.status(500).json({ message: "Gagal update lamaran" });
  }
};
