const { client } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");

const userProfiles = client.db("karirMu").collection("user_profiles");

exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      headline,
      address,
      location,
      age,
      gender,
      whatsapp,
      photo,
      about_me,
    } = req.body;

    const payload = {
      user_id: new ObjectId(userId),
      headline,
      address,
      location,
      age: Number(age),
      gender,
      whatsapp,
      photo,
      about_me,
      updated_at: new Date(),
    };

    const result = await userProfiles.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: payload,
        $setOnInsert: {
          portofolio_id: uuidv4(),
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "User profile berhasil disimpan",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await userProfiles.findOne({
      user_id: new ObjectId(userId),
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile belum dibuat" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upsertUserDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resume_cv, portofolio_link } = req.body;

    const result = await userDocuments.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: {
          resume_cv,
          portofolio_link,
        },
        $setOnInsert: {
          user_document_id: uuidv4(),
          user_id: new ObjectId(userId),
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      message: "Dokumen user berhasil disimpan",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDocument = async (req, res) => {
  try {
    const userId = req.user.userId;

    const documents = await userDocuments.findOne({
      user_id: new ObjectId(userId),
    });

    if (!documents) {
      return res.status(404).json({ message: "Dokumen belum tersedia" });
    }

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

