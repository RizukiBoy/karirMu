const express = require("express");
const router = express.Router();


const companyMiddleware = require("../middleware/companyMiddleware")
const authMiddleware = require("../middleware/authMiddleware");
const { getIndustries, createIndustry, deleteIndustry } = require("../controllers/industryController");

// opsional jika kamu punya role guard

/**
 * =======================
 * PUBLIC / MASTER DATA
 * =======================
 */

// GET job fields (dropdown)
router.get(
  "/",
  getIndustries
);

/**
 * =======================
 * ADMIN ONLY
 * =======================
 */

// CREATE job field
router.post(
  "/",
  createIndustry
);

// DELETE job field
router.delete(
  "/:id",
  authMiddleware,
  companyMiddleware,
  deleteIndustry
);

module.exports = router;
