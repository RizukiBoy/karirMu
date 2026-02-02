const { client } = require("../config/database");
const { ObjectId } = require("mongodb");

const industries = client.db("karirMu").collection("industries");
const companies = client.db("karirMu").collection("companies");


exports.createIndustry = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Nama industry wajib diisi",
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    const exists = await industries.findOne({ slug });
    if (exists) {
      return res.status(409).json({
        message: "Industry sudah ada",
      });
    }

    const newIndustry = {
      name: name.trim(),
      slug,
      description: description || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await industries.insertOne(newIndustry);

    return res.status(201).json({
      message: "Industry berhasil dibuat",
      data: {
        _id: result.insertedId,
        ...newIndustry,
      },
    });
  } catch (error) {
    console.error("ERROR createIndustry:", error);
    return res.status(500).json({
      message: "Gagal membuat industry",
      error: error.message,
    });
  }
};

exports.getIndustries = async (req, res) => {
  try {
    const data = await industries
      .find({})
      .project({
        name: 1,
        slug: 1,
      })
      .sort({ name: 1 })
      .toArray();

    return res.status(200).json({
      message: "List industries",
      data,
    });
  } catch (error) {
    console.error("ERROR getIndustries:", error);
    return res.status(500).json({
      message: "Gagal mengambil industries",
      error: error.message,
    });
  }
};


exports.deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID industry tidak valid",
      });
    }

    const industryObjectId = new ObjectId(id);

    // 1️⃣ Pastikan ada
    const industry = await industries.findOne({
      _id: industryObjectId,
    });

    if (!industry) {
      return res.status(404).json({
        message: "Industry tidak ditemukan",
      });
    }

    // 2️⃣ Cek dipakai company
    const usedByCompany = await companies.findOne({
      industry_id: industryObjectId,
    });

    if (usedByCompany) {
      return res.status(409).json({
        message:
          "Industry tidak dapat dihapus karena masih digunakan oleh company",
      });
    }

    // 3️⃣ Delete
    await industries.deleteOne({ _id: industryObjectId });

    return res.status(200).json({
      message: "Industry berhasil dihapus",
    });
  } catch (error) {
    console.error("ERROR deleteIndustry:", error);
    return res.status(500).json({
      message: "Gagal menghapus industry",
      error: error.message,
    });
  }
};
