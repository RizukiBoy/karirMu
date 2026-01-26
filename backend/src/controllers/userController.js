const { client } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");

const userProfiles = client.db("karirMu").collection("user_profiles");
const userDocuments = client.db("karirMu").collection("user_documents");
const userEducations = client.db("karirMu").collection("user_educations");
const userSkills = client.db("karirMu").collection("user_skills");
const workExperiences = client.db("karirMu").collection("work_experiences")

exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Guard agar tidak crash jika body kosong
    if (!req.body) {
      return res.status(400).json({
        message: "Request body tidak terbaca",
      });
    }

    const {
      headline,
      address,
      location,
      age,
      gender,
      whatsapp,
      about_me,
    } = req.body;

    // =======================
    // Photo dari Cloudinary (URL STRING)
    // =======================
    let photoUrl;

    if (req.file) {
      photoUrl = req.file.path; // URL Cloudinary
    }

    const payload = {
      user_id: new ObjectId(userId),
      headline,
      address,
      location,
      age: age ? Number(age) : null,
      gender,
      whatsapp,
      about_me,
      updated_at: new Date(),
    };

    // hanya update photo jika upload baru
    if (photoUrl) {
      payload.photo = photoUrl;
    }

    await userProfiles.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: payload,
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "User profile berhasil disimpan",
      photo_url: photoUrl || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await userProfiles.findOne({
      user_id: new ObjectId(userId),
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile belum dibuat" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upsertUserDocument = async (req, res) => {
  try {
    const userId = req.user.userId;

    const payload = {
      updated_at: new Date(),
    };

    // =========================
    // CV FILE → CLOUDINARY
    // =========================
    if (req.file) {
      payload.resume_cv = req.file.path; // URL Cloudinary
    }

    // =========================
    // PORTOFOLIO LINK (OPTIONAL)
    // =========================
    if (req.body.portofolio_link !== undefined) {
      payload.portofolio_link = req.body.portofolio_link || null;
    }

    await userDocuments.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: payload,
        $setOnInsert: {
          user_id: new ObjectId(userId),
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "Dokumen user berhasil disimpan",
      resume_cv: payload.resume_cv || null,
      portofolio_link: payload.portofolio_link || null,
    });
  } catch (error) {
    console.error("UPLOAD DOCUMENT ERROR:", error);
    res.status(500).json({
      message: "Gagal menyimpan dokumen user",
    });
  }
};

exports.getUserDocument = async (req, res) => {
  try {
    const userId = req.user.userId;

    const document = await userDocuments.findOne({
      user_id: new ObjectId(userId),
    });

    res.status(200).json({
      data: document || null,
    });
  } catch (error) {
    console.error("GET USER DOCUMENT ERROR:", error);
    res.status(500).json({
      message: "Gagal mengambil dokumen user",
    });
  }
};

exports.createUserEducation = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.body) {
      return res.status(400).json({
        message: "Request body tidak terbaca",
      });
    }

    const {
      study_level,
      institution,
      major,
      graduate,
    } = req.body;

    // =======================
    // VALIDASI WAJIB
    // =======================
    if (!study_level || !institution) {
      return res.status(400).json({
        message: "Jenjang pendidikan dan institusi wajib diisi",
      });
    }

    const allowedLevels = [
      "SMA/SMK Sederajat",
      "SLB",
      "Kuliah",
    ];

    if (!allowedLevels.includes(study_level)) {
      return res.status(400).json({
        message: "Jenjang studi tidak valid",
      });
    }

    // jika ada graduate → harus angka
    if (graduate !== null && graduate !== undefined) {
      if (isNaN(Number(graduate))) {
        return res.status(400).json({
          message: "Tahun lulus tidak valid",
        });
      }
    }

    const payload = {
      user_id: new ObjectId(userId),
      study_level,
      institution,
      major: major || null,
      graduate: graduate ? Number(graduate) : null,
      updated_at: new Date(),
    };

    await userEducations.updateOne(
      {
        user_id: new ObjectId(userId),
        study_level,
      },
      {
        $set: payload,
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "Data pendidikan berhasil disimpan",
    });
  } catch (error) {
    console.error("ERROR createUserEducation:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getUserEducation = async (req, res) => {
  try {
    const userId = req.user.userId;

    const educations = await userEducations
      .find(
        { user_id: new ObjectId(userId) },
        {
          _id: 0, // optional: sembunyikan _id mongo
          user_id: 0,
        }
      )
      .sort({ created_at: 1 })
      .toArray();

    // mapping agar frontend mudah baca
    const result = educations.map((edu) => ({
      study_level: edu.study_level,
      institution: edu.institution,
      major: edu.major,
      graduate: edu.graduate, // null = belum lulus
      graduate_status: edu.graduate ? "lulus" : "belum_lulus",
    }));

    res.status(200).json({
      message: "Data pendidikan berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error("ERROR getUserEducation:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createUserSkill = async (req, res) => {
  try {
    const userId = req.user.userId;

    // =======================
    // GUARD BODY
    // =======================
    if (!req.body) {
      return res.status(400).json({
        message: "Request body tidak terbaca",
      });
    }

    const { name_skill } = req.body;

    // =======================
    // VALIDASI
    // =======================
    if (!name_skill || !name_skill.trim()) {
      return res.status(400).json({
        message: "Nama skill wajib diisi",
      });
    }

    const payload = {
      user_id: new ObjectId(userId),
      name_skill: name_skill.trim(),
      updated_at: new Date(),
    };

    // =======================
    // UPSERT (CREATE / UPDATE)
    // =======================
    await userSkills.updateOne(
      {
        user_id: new ObjectId(userId),
        name_skill: payload.name_skill, // 🔑 unique per user
      },
      {
        $set: payload,
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "Skill berhasil disimpan",
    });
  } catch (error) {
    console.error("ERROR createUserSkill:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getUserSkills = async (req, res) => {
  try {
    const userId = req.user.userId;

    const skills = await userSkills
      .find(
        { user_id: new ObjectId(userId) },
        {
          _id: 0,
          user_id: 0,
        }
      )
      .sort({ created_at: 1 })
      .toArray();

    res.status(200).json({
      message: "Data skill berhasil diambil",
      data: skills,
    });
  } catch (error) {
    console.error("ERROR getUserSkills:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createWorkExperience = async (req, res) => {
try {
  const userId = req.user.userId;

    const {
      company_name,
      job_title,
      start_date,
      end_date,
      description,
    } = req.body;

    if (!userId|| !company_name || !job_title || !start_date) {
      return res.status(400).json({
        message: "company_name, job_title, dan start_date wajib diisi",
      });
    }

    const data = {
      user_id: new ObjectId(userId),
      company_name,
      job_title,
      start_date: Number(start_date),
      end_date: end_date ? Number(end_date) : null,
      description: description || "",
      created_at: new Date(),
      updated_at: new Date(),
    };

    await workExperiences.insertOne(data);

    return res.status(201).json({
      message: "Work experience berhasil ditambahkan",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkExperienceByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await workExperiences
      .find({ user_id: new ObjectId(userId) })
      .sort({ start_date: -1 })
      .toArray();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};










