const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createJobs, getJobDetail, getJobsByCompany, getJ, updateJob,
    updateJobAdminAUM
} = require("../controllers/jobController");
const companyMiddleware = require("../middleware/companyMiddleware")

// post
router.post(
  "/jobs", authMiddleware, companyMiddleware, createJobs);

// get
router.get("/jobs/",authMiddleware, companyMiddleware, getJobsByCompany);

// update
router.put("/jobs/:jobId", authMiddleware, companyMiddleware, updateJobAdminAUM);




module.exports = router;
