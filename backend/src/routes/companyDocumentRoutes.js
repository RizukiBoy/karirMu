const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // Gunakan instance yang sama
const authMiddleware = require("../middleware/authMiddleware");
const companyMiddleware = require("../middleware/companyMiddleware");
const {
    createCompanyDocument,
    createCompanyProfile,
    getDocumentsByCompany,
    createCompanyProfileWithDocuments,
    validateDocument,
} = require("../controllers/companyController");

router.post(
  "/company/submit",
  authMiddleware,
  companyMiddleware,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "documents", maxCount: 10 }
  ]),
  createCompanyProfileWithDocuments
);

// router.post(
//   "/company/submit",
//   authMiddleware,
//   companyMiddleware,
//   companyUploadFields, // Gunakan fields yang sudah didefinisikan
//   createCompanyProfileWithDocuments
// );

// Sisa rute lainnya...
 // Tambahkan "/" di depan "profile"

router.get("/company/profile", authMiddleware, companyMiddleware, getDocumentsByCompany);

module.exports = router;