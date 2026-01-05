const { client } = require("../config/database");

const companyHrd = client
  .db("karirMu")
  .collection("company_hrd");
exports.getMyCompanyHRD = async (req, res) => {
  try {
    const userId = req.user.userId;

    const hrd = await companyHrd.findOne({ user_id: userId });

    if (!hrd) {
      return res.status(404).json({
        message: "User bukan admin AUM",
      });
    }

    return res.status(200).json({
      message: "User adalah admin AUM",
      data: hrd,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
