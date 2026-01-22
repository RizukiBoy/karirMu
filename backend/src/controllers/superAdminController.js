const {generateToken} = require("../config/jwt")
const { client } = require("../config/database");
const { ObjectId } = require("mongodb");


const admins = client.db("karirMu").collection("admins");
const users = client.db("karirMu").collection("users");
const companyHrd = client.db("karirMu").collection("company_hrd");
const companies = client.db("karirMu").collection("companies")
const companyDocuments = client.db("karirMu").collection("company_documents")

exports.addAdmin = async (req, res) => {
    try {
    // Ambil data dari request body
    const { admin_id, name, email, password } = req.body;

    // Validasi sederhana
    if (!admin_id || !name || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const adminDoc = {
      admin_id,
      name,
      email,
      password, 
      token: null,
      created_at: new Date()
    };

    // Insert ke collection admins
    const result = await admins.insertOne(adminDoc);

    res.status(201).json({
      message: 'Admin berhasil ditambahkan',
      admin_id: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const admin = await admins.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = generateToken(
      {
        adminId: admin.admin_id,
        email: admin.email,
      },
      process.env.JWT_ADMIN_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      message: "Login admin berhasil",
      accessToken: token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getAdminAumList = async (req, res) => {
  try {
    const data = await users.aggregate([
      // 1️⃣ hanya admin AUM
      {
        $match: { role: "company_hrd" },
      },

      // 2️⃣ join company_hrd
      {
        $lookup: {
          from: "company_hrd",
          localField: "_id",
          foreignField: "user_id",
          as: "hrd",
        },
      },
      { $unwind: "$hrd" },

      // 3️⃣ join companies
      {
        $lookup: {
          from: "companies",
          localField: "hrd.company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 4️⃣ join company_documents
      {
        $lookup: {
          from: "company_documents",
          localField: "hrd.company_id",
          foreignField: "company_id",
          as: "documents",
        },
      },

      // 5️⃣ hitung approved_count, rejected_count, total
      {
        $addFields: {
          total_documents: { $size: "$documents" },
          approved_count: {
            $size: {
              $filter: {
                input: "$documents",
                as: "doc",
                cond: { $eq: ["$$doc.status", "approved"] },
              },
            },
          },
          rejected_count: {
            $size: {
              $filter: {
                input: "$documents",
                as: "doc",
                cond: { $eq: ["$$doc.status", "rejected"] },
              },
            },
          },
        },
      },

      // 6️⃣ tentukan document_status
      {
        $addFields: {
          document_status: {
            $cond: [
              { $eq: ["$total_documents", 0] },
              "pending",
              {
                $cond: [
                  { $gt: ["$rejected_count", 0] },
                  "rejected",
                  {
                    $cond: [
                      { $eq: ["$approved_count", "$total_documents"] },
                      "approved",
                      "pending",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      // 7️⃣ projection final (bersih & siap UI)
      {
        $project: {
          email: 1,
          company_id: "$hrd.company_id",
          company_name: "$company.company_name",

          verification: {
            total_documents: "$total_documents",
            approved_count: "$approved_count",
            rejected_count: "$rejected_count",
            status: "$document_status",
            is_verified: {
              $eq: ["$document_status", "approved"],
            },
          },
        },
      },
    ]).toArray();

    return res.status(200).json({ data });
  } catch (error) {
    console.error("ERROR getAdminAumList:", error);
    res.status(500).json({
      message: "Gagal mengambil data admin AUM",
    });
  }
};

exports.verifyCompanyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status } = req.body; 


    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({
        message: "Document ID tidak valid",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    const result = await companyDocuments.updateOne(
      { _id: new ObjectId(documentId) },
      {
        $set: {
          status,
          validated_at: new Date(),
          updated_at: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: `Dokumen berhasil ${status === "approved" ? "diverifikasi" : "ditolak"}`,
    });
  } catch (error) {
    console.error("ERROR verifyCompanyDocument:", error);
    res.status(500).json({
      message: "Gagal memverifikasi dokumen",
    });
  }
};

exports.getAdminAumDetail = async (req, res) => {
  try {
    const { companyId } = req.params;

    const companyObjectId = new ObjectId(companyId);

    const company = await companies.findOne({ _id: companyObjectId });
    if (!company) {
      return res.status(404).json({ message: "Company tidak ditemukan" });
    }

    const documents = await companyDocuments
      .find({ company_id: companyObjectId })
      .sort({ created_at: -1 })
      .toArray();

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "Tidak ada dokumen untuk company ini" });
    }


    return res.status(200).json({ company, documents });
  } catch (error) {
    console.error("ERROR getAdminAumDetail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

