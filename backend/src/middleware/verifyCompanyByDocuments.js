const {
  isCompanyVerified,
} = require("../helpers/companyVerification.helper");

module.exports = async function verifyCompanyByDocuments(
  req,
  res,
  next
) {
  try {
    const companyId = req.company?._id;

    if (!companyId) {
      return res.status(401).json({
        message: "Company tidak terautentikasi",
      });
    }

    const verified = await isCompanyVerified(companyId);

    if (!verified) {
      return res.status(403).json({
        message:
          "Akun perusahaan belum diverifikasi. Pastikan semua dokumen telah disetujui.",
      });
    }

    next();
  } catch (error) {
    console.error("verifyCompanyByDocuments:", error);
    res.status(500).json({ message: "Server error" });
  }
};


