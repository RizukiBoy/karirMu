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
      industry,
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
          industry,
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
      return res.status(404).json({
        message: "Company HRD tidak ditemukan",
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
    const company = await companies.findOne({
      _id: companyObjectId,
    });

    if (!company) {
      return res.status(404).json({
        message: "Perusahaan tidak ditemukan",
      });
    }

    // =======================
    // 3️⃣ Ambil documents
    // =======================
    const documents = await companyDocuments
      .find({ company_id: companyObjectId })
      .toArray();

    // =======================
    // 4️⃣ Response
    // =======================
    return res.json({
      message: "List company documents",
      company,
      documents,
    });
  } catch (error) {
    console.error("ERROR getDocumentsByCompany:", error);
    return res.status(500).json({
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};


exports.ValidateDocument = async (req, res) => {
    try {
        const {documentId} = req.params;
        const { status } = req.body;

        if(!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "status harus approved atau rejected",
            });
        }

        const result = await companyDocuments.updateOne(
            {_id: new ObjectId(documentId)},
            {
                $set: {
                    status,
                    validated_at : new Date(),
                    updated_at: new Date(),
                },
            }
        );

        if(result.matchedCount === 0 ) {
            return res.status(404).json({
                message: "Document tidak ditemukan",
            })
        }

        res.json({
            message: "document berhasil divalidasi",
        });
    } catch (error) {
        res.status(500).json({
            message: "gagal validasi document",
            error : error.message,
        })
    }
}

