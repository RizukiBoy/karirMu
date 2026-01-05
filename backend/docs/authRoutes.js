/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user with email only
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
