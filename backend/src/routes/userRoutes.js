const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createUserProfile, getUserProfile
} = require("../controllers/userController")
// post
router.post(
  "/profile", authMiddleware, createUserProfile);

// get
router.get("/profile/",authMiddleware, getUserProfile);

module.exports = router;
