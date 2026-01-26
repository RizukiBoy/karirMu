const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")
const {
    createJobs, getJobDetail, getJobsByCompany, updateJob,
    updateJobAdminAUM, applyJob,
    getApplyJobsForCompany,
    updateJobStatus,
    saveJob,
    unsaveJob,
    getSavedJobsForUser,
    checkSavedJob
} = require("../controllers/jobController");
const companyMiddleware = require("../middleware/companyMiddleware");
const { getApplicantDetailForCompany, updateApplication } = require("../controllers/applyJobController");
const verifyCompanyByDocuments = require("../middleware/verifyCompanyByDocuments");

// post
router.post(
  "/jobs", authMiddleware, companyMiddleware, createJobs);

// get
router.get("/jobs/",authMiddleware, companyMiddleware, getJobsByCompany);

router.get("/jobs/:jobId", getJobDetail);

router.get("/applications", authMiddleware, companyMiddleware, getApplyJobsForCompany)

// update
router.put("/jobs/:jobId", authMiddleware, companyMiddleware, updateJobAdminAUM);

router.patch("/jobs/:jobId", updateJobStatus)

router.post(
  "/jobs/:jobId/apply",
  authMiddleware,
  roleMiddleware("pelamar"),
  applyJob
);

router.get("/applications/:applyId", authMiddleware, roleMiddleware("company_hrd"), getApplicantDetailForCompany);
router.patch("/applications/:applyId", authMiddleware, roleMiddleware("company_hrd"), updateApplication)

router.post("/saved-jobs", authMiddleware, saveJob);
router.delete("/saved-jobs/:jobId", authMiddleware, unsaveJob);
router.get("/saved-jobs", authMiddleware, getSavedJobsForUser);
router.get(
  "/saved-jobs/check/:jobId", authMiddleware, checkSavedJob);


module.exports = router;
