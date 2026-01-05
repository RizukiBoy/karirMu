const jwt = require("jsonwebtoken");
const { client } = require('../config/database');
const admins = client.db('karirMu').collection('admins');

module.exports = async function superAdminMiddleware(email) {
  const admin = await admins.findOne({ email });
  if (!admin) throw new Error('Admin not found');

  // generate token sekali saat login
  const token = jwt.sign(
    { admin_id: admin.admin_id, email: admin.email },
    'SECRET_KEY',
    { expiresIn: '1h' }
  );

  await admins.updateOne({ email }, { $set: { token } });

  return token;
};



