const { client } = require("../config/database");
const { ObjectId } = require("mongodb");

const {
  COMPANY_DOCUMENT_VALUES,
} = require("../constants/companyDocumenEnum");

const {
  DOCUMENT_STATUS_ENUM,
} = require("../constants/companyStatusEnum");


const users = client.db("karirMu").collection("users")

const companyDocuments = client
    .db("karirMu")
    .collection("company_documents");

const companies = client
    .db("karirMu")
    .collection("companies");

const companyHrd = client.db("karirMu").collection("company_hrd");
const industries = client.db("karirMu").collection("industries");

exports.createCompanyProfileWithDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;

    // =======================
    // 0️⃣ Validasi userId
    // =======================
    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }
    const userObjectId = new ObjectId(userId);

    // =======================
    // 1️⃣ Ambil user dari DB (SUMBER KEBENARAN)
    // =======================
    const user = await users.findOne(
      { _id: userObjectId },
      { projection: { company_id: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    let companyId = user.company_id || new ObjectId();

    // jika user belum punya company
    if (!user.company_id) {
      await users.updateOne(
        { _id: userObjectId },
        { $set: { company_id: companyId } }
      );
    }

    // =======================
    // 2️⃣ Ambil body
    // =======================
    const {
      company_name,
      description,
      address,
      employee_range,
      industry_id,
      company_email,
      company_phone,
      company_url,
    } = req.body;

    const province = req.body.province || "";
    const city = req.body.city || "";

    let documentNames = [];
    try {
      documentNames = req.body.document_names
        ? JSON.parse(req.body.document_names)
        : [];
    } catch {
      return res.status(400).json({
        message: "Format document_names tidak valid",
      });
    }

    // =======================
    // 3️⃣ Validasi wajib
    // =======================
    if (!company_name || !company_email || !company_phone) {
      return res.status(400).json({
        message: "company_name, company_email, dan company_phone wajib diisi",
      });
    }

    if (!req.files?.logo?.length) {
      return res.status(400).json({ message: "Logo wajib diupload" });
    }

    if (!req.files?.documents?.length) {
      return res.status(400).json({ message: "Dokumen wajib diupload" });
    }

    // =======================
    // 4️⃣ Validasi enum dokumen
    // =======================
    for (const name of documentNames) {
      if (!COMPANY_DOCUMENT_VALUES.includes(name)) {
        return res.status(400).json({
          message: `Jenis dokumen tidak valid: ${name}`,
        });
      }
    }

    // =======================
    // 5️⃣ Ambil URL LOGO
    // =======================
    const logoUrl = req.files.logo[0].path;

    // =======================
// 3️⃣.1 Validasi industry
// =======================
    if (!industry_id || !ObjectId.isValid(industry_id)) {
      return res.status(400).json({
        message: "Industry wajib dipilih",
      });
    }

    const industryObjectId = new ObjectId(industry_id);

    const industry = await industries.findOne({
      _id: industryObjectId,
    });

    if (!industry) {
      return res.status(400).json({
        message: "Industry tidak valid",
      });
    }

    // =======================
    // 6️⃣ Simpan / update COMPANY
    // =======================
    await companies.updateOne(
      { _id: companyId },
      {
        $set: {
          company_name,
          description,
          address,
          city,
          province,
          industry_id: industryObjectId,
          employee_range: Number(employee_range),
          company_email,
          company_phone,
          company_url,
          logo_url: logoUrl,
          updated_at: new Date(),
        },
        $setOnInsert: { created_at: new Date() },
      },
      { upsert: true }
    );

    // =======================
    // 7️⃣ Update company_hrd
    // =======================
    await companyHrd.updateOne(
      { user_id: userObjectId },
      { $set: { company_id: companyId } }
    );

    // =======================
    // 8️⃣ Simpan documents
    // =======================
    const insertedDocs = req.files.documents.map((file, index) => ({
      company_id: companyId,
      document_name: documentNames[index] || file.originalname,
      document_url: file.path,
      status: DOCUMENT_STATUS_ENUM.PENDING,
      validated_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await companyDocuments.insertMany(insertedDocs);

    // =======================
    // 9️⃣ Response
    // =======================
    return res.status(201).json({
      message: "Company profile & documents berhasil dikirim",
    });
  } catch (error) {
    console.error("ERROR createCompanyProfile:", error);
    return res.status(500).json({
      message: "Gagal memproses data company",
      error: error.message,
    });
  }
};

exports.getDocumentsByCompany = async (req, res) => {
  try {
    const userId = req.user.userId;

    // =======================
    // 0️⃣ Validasi userId
    // =======================
    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }
    const userObjectId = new ObjectId(userId);

    // =======================
    // 1️⃣ Ambil company_hrd
    // =======================
    const companyHrdData = await companyHrd.findOne({
      user_id: userObjectId,
    });

    if (!companyHrdData) {
      return res.status(200).json({
        message: "Company HRD belum dibuat",
        company: null,
        documents: [],
      });
    }


    const companyId = companyHrdData.company_id;

    if (!companyId || !ObjectId.isValid(companyId)) {
      return res.status(200).json({
        message: "Company belum dibuat",
        company: null,
        documents: [],
      });
    }

    const companyObjectId = new ObjectId(companyId);

    // =======================
    // 2️⃣ Ambil company
    // =======================
    const companyAgg = await companies.aggregate([
      {
        $match: { _id: companyObjectId },
      },
      {
        $lookup: {
          from: "industries",
          localField: "industry_id",
          foreignField: "_id",
          as: "industry",
        },
      },
      {
        $unwind: {
          path: "$industry",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]).toArray();

    if (!companyAgg.length) {
      return res.status(404).json({
        message: "Perusahaan tidak ditemukan",
      });
    }

    const company = companyAgg[0];


    // =======================
    // 3️⃣ Ambil documents
    // =======================
    const documents = await companyDocuments
      .find({ company_id: companyObjectId })
      .toArray();

      const documentStats = {
        total : documents.length,
        approved: documents.filter(d => d.status === "approved").length,
        rejected: documents.filter(d => d.status === "rejected").length,
        pending: documents.filter(d => !d.status || d.status === "pending").length,
      }
    // =======================
    // 4️⃣ Response
    // =======================
    return res.json({
      message: "List company documents",
      company,
      documents,
      document_stats : documentStats,
    });
  } catch (error) {
    console.error("ERROR getDocumentsByCompany:", error);
    return res.status(500).json({
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // =======================
    // 0️⃣ Validasi userId
    // =======================
    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const userObjectId = new ObjectId(userId);

    // =======================
    // 1️⃣ Ambil user (source of truth)
    // =======================
    const user = await users.findOne(
      { _id: userObjectId },
      { projection: { company_id: 1 } }
    );

    if (!ObjectId.isValid(user.company_id)) {
  return res.status(400).json({ message: "company_id tidak valid" });
}

const companyId = new ObjectId(user.company_id);
    const {
      company_name,
      description,
      address,
      employee_range,
      industry_id,
      company_email,
      company_phone,
      company_url,
      province,
      city,
    } = req.body;

    if (!company_name || !company_email || !company_phone) {
      return res.status(400).json({
        message: "company_name, company_email, dan company_phone wajib diisi",
      });
    }

    let industryObjectId = null;

    if (industry_id) {
      if (!ObjectId.isValid(industry_id)) {
        return res.status(400).json({
          message: "industry_id tidak valid",
        });
      }

      industryObjectId = new ObjectId(industry_id);

      const industry = await industries.findOne({
        _id: industryObjectId,
      });

      if (!industry) {
        return res.status(400).json({
          message: "Industry tidak ditemukan",
        });
      }
    }

    // =======================
    // 4️⃣ Siapkan payload update
    // =======================
    const updatePayload = {
      company_name,
      description,
      address,
      province,
      city,
      employee_range: employee_range
        ? Number(employee_range)
        : null,
      company_email,
      company_phone,
      company_url,
      updated_at: new Date(),
    };

    if (industryObjectId) {
  updatePayload.industry_id = industryObjectId;
  }

    // =======================
    // 5️⃣ Jika logo diupload → update logo
    // =======================
    if (req.files?.logo?.length) {
      updatePayload.logo_url = req.files.logo[0].path;
    }

    // =======================
    // 6️⃣ Update company
    // =======================
    const result = await companies.findOneAndUpdate(
      { _id: companyId },
      { $set: updatePayload },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({
        message: "Company tidak ditemukan",
      });
    }

    // =======================
    // 7️⃣ Response
    // =======================
    return res.status(200).json({
      message: "Profil company berhasil diperbarui",
      company: result.value,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal memperbarui profil company",
      error: error.message,
    });
  }
};


