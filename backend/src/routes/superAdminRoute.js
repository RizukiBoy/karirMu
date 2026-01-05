const express = require("express");
const router = express.Router();
const superAdmin = require("../middleware/superAdminMiddleware");
const {addAdmin, login } = require("../controllers/superAdminController");

router.post("/add", addAdmin)
router.post("/login-admin", login);
router.post("/dashboard", superAdmin, (req, res) => {
  res.json({
    message: "Selamat datang Superadmin",
    admin: req.admin,
  });
});

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin and return JWT access token valid for 8 hours.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login admin berhasil
 *                 accessToken:
 *                   type: string
 *                 admin:
 *                   type: object
 *                   properties:
 *                     admin_id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     name:
 *                       type: string
 *                       example: Admin Test
 *                     email:
 *                       type: string
 *                       example: admin@test.com
 *       400:
 *         description: Email atau password tidak dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email dan password wajib diisi
 *       401:
 *         description: Credential invalid (email/password salah)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email atau password salah
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get("/dashboard", superAdmin, (req, res) => {
  res.json({
    message: "Selamat datang Superadmin",
    admin: req.admin,
  });
});

module.exports = router;
