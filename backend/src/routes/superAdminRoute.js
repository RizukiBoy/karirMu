const express = require("express");
const router = express.Router();
const superAdmin = require("../middleware/superAdminMiddleware");
const {addAdmin, login, getAdminAumList, getAdminAumDetail, verifyCompanyDocument, getAdminDashboardSummary, verifyCompanyAccount } = require("../controllers/superAdminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", addAdmin);
router.post("/login", login);
router.get("/dashboard", getAdminDashboardSummary);

router.get("/admin-aum", getAdminAumList)
router.get("/admin-aum/:companyId", getAdminAumDetail)

router.patch("/admin-aum/document/:documentId", verifyCompanyDocument)
router.patch("/:companyId/verify-account", authMiddleware, verifyCompanyAccount);

module.exports = router;
