const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createJobs, getJobDetail, getJobsByCompany, getPublicJobs, updateJob
} = require("../controllers/jobController");
const companyMiddleware = require("../middleware/companyMiddleware")

// post
router.post(
  "/jobs", authMiddleware, companyMiddleware, createJobs);

// get
router.get("/jobs/company",authMiddleware, getJobsByCompany);

router.get("jobs/:id", getJobDetail)

// update
router.put("/jobs/:jobId", authMiddleware, updateJob);




module.exports = router;
