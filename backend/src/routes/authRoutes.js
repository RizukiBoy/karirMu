const express = require("express");
const {
  register,
  activateAccount,
  login,
} = require("../controllers/authController");
const authmiddleware = require("../middleware/authMiddleware");
const companyMiddleware = require("../middleware/companyMiddleware");

const router = express.Router();

router.post("/register", register);

// 🔥 HARUS GET (klik link email)
router.post("/activate", activateAccount);

router.post("/login", login);

router.get("/dashboard-user", authmiddleware, (req, res) => {
  res.status(201).json({ message: "dashboard user" });
});
router.get("/dashboard-admin-aum", authmiddleware, companyMiddleware, (req, res) => {
  res.status(201).json({ message: "dashboard admin aum" });
});
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register user with email only. User can choose to register as normal user or company HRD.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - register_as
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@test.com
 *               register_as:
 *                 type: string
 *                 description: Role selection for registration (user or company_hrd)
 *                 enum: [user, company_hrd]
 *                 example: user
 *     responses:
 *       201:
 *         description: Registration successful, email sent for activation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil, silakan cek email untuk aktivasi.
 *       400:
 *         description: Email atau register_as tidak dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email harus diisi
 *       409:
 *         description: Email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email sudah terdaftar
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

router.post("/register", register);

/**
 * @swagger
 * /api/auth/activate:
 *   post:
 *     summary: Activate account using token
 *     description: Activate user account after registration. Token harus dikirim di body.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Activation token
 *                 example: "e3b0c44298fc1c149afbf4c8996fb924"
 *     responses:
 *       200:
 *         description: Account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Akun aktif. Silakan login
 *       400:
 *         description: Token tidak dikirim atau token tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token tidak valid
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

router.post("/activate", activateAccount);

/**
 * @swagger
 * /api/auth/set-password:
 *   post:
 *     summary: Set password for the first time and auto login
 *     description: User sets their password using the token sent via email after account activation.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - full_name
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token from email activation
 *                 example: "e3b0c44298fc1c149afbf4c8996fb924"
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Password set successfully, user auto logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password berhasil dibuat
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Validation errors (missing input, token invalid, account not active, password exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token tidak valid atau sudah kedaluwarsa
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


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticate user and return JWT access token.
 *     tags: [Auth]
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
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: password123
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
 *                   example: Login berhasil
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: user@test.com
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
 *       403:
 *         description: Account not active or password not set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Akun belum diaktivasi
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

router.post("/login", login);

/**
 * @swagger
 * /api/auth/dashboard-user:
 *   get:
 *     summary: Get user dashboard (protected)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.get("/dashboard-user", authmiddleware);

module.exports = router;
