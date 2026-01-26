const express = require("express");
const router = express.Router();

const {getPublicJobs, getPublicJobDetail} = require("../controllers/jobController");

router.get("/jobs/:jobId", getPublicJobDetail)
router.get("/jobs", getPublicJobs)


module.exports = router