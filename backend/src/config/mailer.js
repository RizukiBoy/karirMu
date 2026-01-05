const nodemailer = require("nodemailer");

async function sendTokenActivation(email, activationLink) {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

      const linkAktivasi = activationLink;
  const mailOptions = {
    from: '"Admin Website" <akhmadoktariski@gmail.com>',
    to: email,
    subject: "Aktivasi Akun Anda",
    html: `
      <h3>Halo!</h3>
      <p>Terima kasih sudah mendaftar. Klik tautan berikut untuk mengaktifkan akun Anda:</p>
      <a href="${linkAktivasi}" style="color:#5e4caf;">Aktifkan Sekarang</a>
      <p>Jika Anda tidak merasa mendaftar, abaikan pesan ini.</p>
    `,
  };

   await transporter.sendMail(mailOptions);
  console.log("Email aktivasi dikirim ke:", email);
}

module.exports = { sendTokenActivation };
