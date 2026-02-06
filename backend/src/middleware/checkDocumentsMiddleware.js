const { client } = require("../config/database");
const { ObjectId } = require("mongodb");

// Collections
const users = client.db("karirMu").collection("users");
const companyDocuments = client
  .db("karirMu")
  .collection("company_documents");

  
module.exports = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({
        message: "User tidak valid",
      });
    }

    // =======================
    // Ambil company user
    // =======================
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { company_id: 1 } }
    );

    if (!user?.company_id) {
      req.jobStatus = false;
      return next();
    }

    // =======================
    // Hitung dokumen approved
    // =======================
    const approvedDocsCount = await companyDocuments.countDocuments({
      company_id: new ObjectId(user.company_id),
      status: "approved",
    });

    // =======================
    // Simpan hasil ke request
    // =======================
    req.jobStatus = approvedDocsCount === 4;

    return next();
  } catch (error) {
    console.error("ERROR checkCompanyDocuments middleware:", error);
    return res.status(500).json({
      message: "Gagal memvalidasi dokumen perusahaan",
    });
  }
};
