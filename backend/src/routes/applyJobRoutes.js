const express = require("express");
const router = express.Router();
const { applyJob, getAppliedJobsForUser } = require("../controllers/applyJobController")
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")
router.post(
  "/jobs/:jobId",
  authMiddleware,
  roleMiddleware("pelamar"), // ⬅️ hanya pelamar
  applyJob
);
module.exports = router