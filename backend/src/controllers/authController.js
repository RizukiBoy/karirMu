const crypto = require("crypto");
const {sendTokenActivation} = require("../config/mailer")
const {client} = require("../config/database");
const bcrypt = require("bcrypt")
const {generateToken} = require("../config/jwt")


const users = client.db("karirMu").collection("users")
const companyHrd = client.db("karirMu").collection("company_hrd");


exports.register = async (req, res) => {
  try {
    const { email, fullName, password, register_as} = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Email dan role wajib diisi" });
    }

    if (!["pelamar", "company_hrd"].includes(register_as)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const result = await users.insertOne({
      email,
      role: register_as, // 🔥 SIMPAN ROLE
      full_name : fullName,
      password : hashedPassword,
      token,
      is_active: false,
      created_at: new Date(),
    });


    const userObjectId = result.insertedId

    if (register_as === "company_hrd") {
      await companyHrd.insertOne({
        user_id: userObjectId,
        company_id: null,
        created_at: new Date(),
      });
    }

    const activationLink =
      `http://localhost:5173/auth/activate?token=${token}`;

    await sendTokenActivation(email, activationLink);

    return res.status(201).json({
      message: "Registrasi berhasil, silakan cek email untuk aktivasi",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;

  console.log("BODY:", req.body);
console.log("HEADERS:", req.headers["content-type"]);


  if (!token) {
    return res.status(400).json({ message: "Token wajib dikirim" });
  }
    const user = await users.findOne({ token });


  if (!user) {
    return res.status(400).json({ message: "Token tidak valid" });
  }

  await users.updateOne(
    { _id: user._id},
    {
      $set: {
        is_active: true,
      }
    }
  );

  res.json({
    message: "Akun aktif. Silakan login",
  });
};

exports.setPassword = async (req, res) => {
  try {
    const {token, full_name, password } = req.body;

    // 1. Validasi input
    if (!full_name || !password) {
      return res.status(400).json({
        message: "nama lengkap, dan password wajib diisi",
      });
    }

    const user = await users.findOne({ token });

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "Token tidak valid atau sudah kedaluwarsa",
      });
    }

    if (!user.is_active) {
      return res.status(400).json({
        message: "Akun belum aktif",
      });
    }

    if (user.password) {
      return res.status(400).json({
        message: "Password sudah dibuat",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update user
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          full_name,
          password: hashedPassword,
        },
         $unset: {
        token: "",
        }
      }
    );

    // 5. Generate JWT (AUTO LOGIN)
    const accessToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return res.status(200).json({
      message: "Password berhasil dibuat",
      accessToken,
      user: {
        full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    // 2. Cari user
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // 3. Cek aktivasi akun
    if (!user.is_active) {
      return res.status(403).json({
        message: "Akun belum diaktivasi",
      });
    }

    // 4. Validasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // 🔥 ROLE LANGSUNG DARI USERS
    const role = user.role;

    // 5. Generate JWT
    const accessToken = generateToken({
      userId: user._id.toString(),
      role,
      email: user.email,
    });

    // 6. Response sukses
    return res.status(200).json({
      message: "Login berhasil",
      accessToken,
      role, // 🔥 kirim ke frontend
      user: {
        full_name: user.full_name,
        email: user.email,
        company_id: user.company_id || null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};