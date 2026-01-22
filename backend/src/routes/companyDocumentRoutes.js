const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authMiddleware = require("../middleware/authMiddleware");
const companyMiddleware = require("../middleware/companyMiddleware");
const {
    getDocumentsByCompany,
    createCompanyProfileWithDocuments,
    updateCompanyProfile,
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

router.put(
  "/company/edit-profile",
  authMiddleware, companyMiddleware,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateCompanyProfile
);

router.get("/company/profile", authMiddleware, companyMiddleware, getDocumentsByCompany);

module.exports = router;