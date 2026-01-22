const express = require("express");
const router = express.Router();

const {getPublicJobs} = require("../controllers/jobController");

router.get("/jobs/:jobId", getPublicJobs)
router.get("/jobs", getPublicJobs)


module.exports = router