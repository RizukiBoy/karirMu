const express = require("express");
const router = express.Router();
const superAdmin = require("../middleware/superAdminMiddleware");
const {addAdmin, login, getAdminAumList, getAdminAumDetail, verifyCompanyDocument } = require("../controllers/superAdminController");

router.post("/add", addAdmin)
router.post("/login", login);
router.post("/dashboard", superAdmin, (req, res) => {
  res.json({
    message: "Selamat datang Superadmin",
    admin: req.admin,
  });
});

router.get("/dashboard", superAdmin, (req, res) => {
  res.json({
    message: "Selamat datang Superadmin",
    admin: req.admin,
  });
});

router.get("/admin-aum", getAdminAumList)
router.get("/admin-aum/:companyId", getAdminAumDetail)

router.patch("/admin-aum/document/:documentId", verifyCompanyDocument)

module.exports = router;
