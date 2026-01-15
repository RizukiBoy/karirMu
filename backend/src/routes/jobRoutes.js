const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")
const {
    createJobs, getJobDetail, getJobsByCompany, updateJob,
    updateJobAdminAUM, applyJob,
    getApplyJobsForCompany
} = require("../controllers/jobController");
const companyMiddleware = require("../middleware/companyMiddleware");
const { getApplicantDetailForCompany, updateApplication } = require("../controllers/applyJobController");
const verifyCompanyByDocuments = require("../middleware/verifyCompanyByDocuments");

// post
router.post(
  "/jobs", authMiddleware, companyMiddleware, verifyCompanyByDocuments, createJobs);

// get
router.get("/jobs/",authMiddleware, companyMiddleware, getJobsByCompany);

router.get("/jobs/:jobId", getJobDetail);

router.get("/applications", authMiddleware, companyMiddleware, getApplyJobsForCompany)

// update
router.put("/jobs/:jobId", authMiddleware, companyMiddleware, updateJobAdminAUM);

router.post(
  "/jobs/:jobId/apply",
  authMiddleware,
  roleMiddleware("pelamar"),
  applyJob
);

router.get("/applications/:applyId", authMiddleware, roleMiddleware("company_hrd"), getApplicantDetailForCompany);
router.patch("/applications/:applyId", authMiddleware, roleMiddleware("company_hrd"), updateApplication)

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Endpoint publik untuk lowongan pekerjaan
 */
/**
 * @swagger
 * /api/public/jobs:
 *   get:
 *     summary: Mengambil daftar lowongan pekerjaan
 *     description: Endpoint publik untuk mengambil daftar lowongan pekerjaan yang masih aktif dengan fitur pencarian, filter, dan pagination.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian berdasarkan nama pekerjaan, deskripsi, atau requirement
 *         example: developer
 *       - in: query
 *         name: job_field
 *         schema:
 *           type: string
 *         description: ID bidang pekerjaan
 *         example: 64b8f7c2a1d9e123456789ab
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Lokasi pekerjaan
 *         example: Jakarta
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Tipe pekerjaan
 *         example: Full Time
 *       - in: query
 *         name: work_type
 *         schema:
 *           type: string
 *         description: Sistem kerja
 *         example: Remote
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *         example: 10
 *     responses:
 *       200:
 *         description: Daftar lowongan pekerjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 35
 *                 total_pages:
 *                   type: integer
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       job_name:
 *                         type: string
 *                         example: Backend Developer
 *                       location:
 *                         type: string
 *                         example: Jakarta
 *                       type:
 *                         type: string
 *                         example: Full Time
 *                       work_type:
 *                         type: string
 *                         example: Hybrid
 *                       salary_min:
 *                         type: integer
 *                         example: 5000000
 *                       salary_max:
 *                         type: integer
 *                         example: 9000000
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       company:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           company_name:
 *                             type: string
 *                             example: PT Maju Mundur
 *                           logo_url:
 *                             type: string
 *                             example: https://logo.company.com/logo.png
 *                       job_field:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: Teknologi Informasi
 *       500:
 *         description: Gagal mengambil data lowongan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal mengambil data lowongan
 */

/**
 * @swagger
 * /api/jobs/{jobId}:
 *   get:
 *     summary: Mengambil detail lowongan pekerjaan
 *     description: Endpoint publik untuk mengambil detail satu lowongan pekerjaan berdasarkan ID.
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID lowongan pekerjaan
 *         example: 64b8f7c2a1d9e123456789ab
 *     responses:
 *       200:
 *         description: Detail lowongan pekerjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Detail lowongan
 *                 data:
 *                   type: object
 *                   properties:
 *                     job_name:
 *                       type: string
 *                       example: Backend Developer
 *                     location:
 *                       type: string
 *                       example: Jakarta
 *                     type:
 *                       type: string
 *                       example: Full Time
 *                     work_type:
 *                       type: string
 *                       example: Onsite
 *                     salary_min:
 *                       type: integer
 *                       example: 6000000
 *                     salary_max:
 *                       type: integer
 *                       example: 10000000
 *                     requirement:
 *                       type: string
 *                       example: Menguasai Node.js dan MongoDB
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     job_field:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                           example: Teknologi Informasi
 *                     company:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         company_name:
 *                           type: string
 *                           example: PT Maju Mundur
 *                         logo_url:
 *                           type: string
 *                           example: https://logo.company.com/logo.png
 *                         city:
 *                           type: string
 *                           example: Jakarta
 *                         province:
 *                           type: string
 *                           example: DKI Jakarta
 *                         industry:
 *                           type: string
 *                           example: Software House
 *       400:
 *         description: Job ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job ID tidak valid
 *       404:
 *         description: Lowongan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lowongan tidak ditemukan
 *       500:
 *         description: Gagal mengambil detail lowongan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal mengambil detail lowongan
 */



module.exports = router;
