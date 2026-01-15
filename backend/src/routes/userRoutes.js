const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const {
    createUserProfile,
    getUserProfile,
    upsertUserDocument,
    getUserDocument,
    createUserEducation,
    getUserEducation,
    createUserSkill,
    getUserSkills,
    createWorkExperience,
    getWorkExperienceByUser,
} = require("../controllers/userController");
const roleMiddleware = require("../middleware/roleMiddleware");

// get
router.get("/profile" ,authMiddleware, roleMiddleware("pelamar"), getUserProfile);
router.get("/document", authMiddleware, getUserDocument);
router.get("/education", authMiddleware, roleMiddleware("pelamar"), getUserEducation);
router.get("/skill", authMiddleware, roleMiddleware("pelamar"), getUserSkills);
router.get("/work-experience", authMiddleware, roleMiddleware("pelamar"), getWorkExperienceByUser);


// post
router.post("/profile", upload.single("photo"), authMiddleware, createUserProfile);
router.post("/document", authMiddleware, roleMiddleware("pelamar"), upload.single("resume_cv"), upsertUserDocument);
router.post("/education", authMiddleware, roleMiddleware("pelamar"), createUserEducation);
router.post("/skill", authMiddleware, roleMiddleware("pelamar"), createUserSkill);
router.post("/work-experience", authMiddleware, roleMiddleware("pelamar"), createWorkExperience)

/**
 * @swagger
 * /api/user/profile:
 *   post:
 *     summary: Membuat atau memperbarui profile user
 *     description: Endpoint untuk membuat atau mengupdate profile user (pelamar). Endpoint ini menggunakan autentikasi JWT dan mendukung upload foto profile.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               headline:
 *                 type: string
 *                 example: Fresh Graduate Web Developer
 *               address:
 *                 type: string
 *                 example: Jl. Merdeka No. 10
 *               location:
 *                 type: string
 *                 example: Jakarta
 *               age:
 *                 type: integer
 *                 example: 22
 *               gender:
 *                 type: string
 *                 enum: [Laki-laki, Perempuan]
 *                 example: Laki-laki
 *               whatsapp:
 *                 type: string
 *                 example: 081234567890
 *               about_me:
 *                 type: string
 *                 example: Saya tertarik pada bidang web development dan backend.
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Foto profile user
 *     responses:
 *       200:
 *         description: Profile berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile berhasil disimpan
 *                 photo_url:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/profile.jpg
 *       400:
 *         description: Request body tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request body tidak terbaca
 *       401:
 *         description: Unauthorized (token tidak valid atau tidak dikirim)
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Mengambil data profile user
 *     description: Endpoint untuk mengambil data profile user yang sedang login (khusus role pelamar).
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profile user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   example: 64b8f7c2a1d9e123456789ab
 *                 headline:
 *                   type: string
 *                   example: Fresh Graduate Web Developer
 *                 address:
 *                   type: string
 *                   example: Jl. Merdeka No. 10
 *                 location:
 *                   type: string
 *                   example: Jakarta
 *                 age:
 *                   type: integer
 *                   example: 22
 *                 gender:
 *                   type: string
 *                   example: Laki-laki
 *                 whatsapp:
 *                   type: string
 *                   example: 081234567890
 *                 about_me:
 *                   type: string
 *                   example: Saya tertarik pada bidang web development dan backend.
 *                 photo:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/profile.jpg
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile belum dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile belum dibuat
 *       500:
 *         description: Server error
 */


module.exports = router;
