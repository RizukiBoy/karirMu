const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jobs = client.db("karirMu").collection("jobs");
const jobFields = client.db("karirMu").collection("job_fields")


exports.createJobField = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Nama job field wajib diisi",
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    const exists = await jobFields.findOne({ slug });
    if (exists) {
      return res.status(409).json({
        message: "Job field sudah ada",
      });
    }

    const newJobField = {
      name: name.trim(),
      slug,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await jobFields.insertOne(newJobField);

    return res.status(201).json({
      message: "Job field berhasil dibuat",
      data: {
        _id: result.insertedId, // ✅ INI KUNCINYA
        ...newJobField,
      },
    });
  } catch (error) {
    console.error("ERROR createJobField:", error);
    return res.status(500).json({
      message: "Gagal membuat job field",
      error: error.message,
    });
  }
};


exports.getJobFields = async (req, res) => {
  try {
    const fields = await jobFields
      .find({})
      .project({
        name: 1,
        slug: 1,
      })
      .sort({ name: 1 })
      .toArray();

    return res.status(200).json({
      message: "List job fields",
      data: fields, // ✅ ADA _id
    });
  } catch (error) {
    console.error("ERROR getJobFields:", error);
    return res.status(500).json({
      message: "Gagal mengambil job fields",
      error: error.message,
    });
  }
};


exports.deleteJobField = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID job field tidak valid",
      });
    }

    const jobFieldObjectId = new ObjectId(id);

    // 1️⃣ Pastikan ada
    const jobField = await jobFields.findOne({
      _id: jobFieldObjectId,
    });

    if (!jobField) {
      return res.status(404).json({
        message: "Job field tidak ditemukan",
      });
    }

    // 2️⃣ Cek dipakai job
    const usedByJob = await jobs.findOne({
      job_field_id: jobFieldObjectId,
    });

    if (usedByJob) {
      return res.status(409).json({
        message: "Job field tidak dapat dihapus karena masih digunakan oleh lowongan",
      });
    }

    // 3️⃣ Delete
    await jobFields.deleteOne({ _id: jobFieldObjectId });

    return res.status(200).json({
      message: "Job field berhasil dihapus",
    });
  } catch (error) {
    console.error("ERROR deleteJobField:", error);
    return res.status(500).json({
      message: "Gagal menghapus job field",
      error: error.message,
    });
  }
};
