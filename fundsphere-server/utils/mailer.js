const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"Hobby Hive" ${process.env.EMAIL_USER}`,
    to,
    subject,
    html,
    replyTo: "no-reply@hobbyhive.com",
  });

  console.log("Email sent:", info.messageId);
  return info;
};

module.exports = { sendMail };
