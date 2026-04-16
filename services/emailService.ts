import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendAlertEmail = async (user: any, issue: any) => {
  await transporter.sendMail({
    from: "OrbitX MCN <" + process.env.EMAIL_USER + ">",
    to: user.email,
    subject: "🚨 OrbitX MCN Alert: Important Channel Issue",
    html: `
      <h2>Dear Creator,</h2>
      <p>OrbitX MCN has detected a critical issue on your channel.</p>
      <p><b>🔴 Issue Type:</b> ${issue.issueType}</p>
      <p><b>🎬 Video Title:</b> ${issue.title}</p>
      <p><b>📅 Date:</b> ${new Date(issue.createdAt).toLocaleDateString()}</p>
      <p>This issue may affect your revenue and channel status.</p>
      <p>👉 Please review your YouTube Studio immediately.</p>
      <p>For support, contact OrbitX MCN Team.</p>
      <p>Best regards,<br>OrbitX MCN Support</p>
    `
  });
};
