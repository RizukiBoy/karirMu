const jwt = require("jsonwebtoken");
const { client } = require("../config/database");

const admins = client.db("karirMu").collection("admins");

exports.addAdmin = async (req, res) => {
    try {
    // Ambil data dari request body
    const { admin_id, name, email, password } = req.body;

    // Validasi sederhana
    if (!admin_id || !name || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const adminDoc = {
      admin_id,
      name,
      email,
      password, 
      token: null,
      created_at: new Date()
    };

    // Insert ke collection admins
    const result = await admins.insertOne(adminDoc);

    res.status(201).json({
      message: 'Admin berhasil ditambahkan',
      admin_id: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const admin = await admins.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin.admin_id,
        email: admin.email,
      },
      process.env.JWT_ADMIN_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      message: "Login admin berhasil",
      accessToken: token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
