const express = require("express");
const router = express.Router();

const {
  getJobFields,
  createJobField,
  deleteJobField,
} = require("../controllers/jobFieldController");

const companyMiddleware = require("../middleware/companyMiddleware")
const authMiddleware = require("../middleware/authMiddleware");

// opsional jika kamu punya role guard

/**
 * =======================
 * PUBLIC / MASTER DATA
 * =======================
 */

// GET job fields (dropdown)
router.get(
  "/",
  getJobFields
);

/**
 * =======================
 * ADMIN ONLY
 * =======================
 */

// CREATE job field
router.post(
  "/",
  authMiddleware,
  companyMiddleware,
  createJobField
);

// DELETE job field
router.delete(
  "/:id",
  authMiddleware,
  companyMiddleware,
  deleteJobField
);

module.exports = router;
