
import mongoose from 'mongoose';
import EmailTemplate from '../models/EmailTemplate';
import dotenv from 'dotenv';
import { connectMongoDB } from '../config/db';

dotenv.config();

const seed = async () => {
  await connectMongoDB();

  const inviteTemplate = {
    name: 'Default Invite',
    subject: "You're Invited to Join OrbitX MCN",
    body: `<!DOCTYPE html><html>
<head>
  <meta charset="UTF-8">
  <title>OrbitX MCN Invite</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f6f8;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;"><!-- Header -->
<tr>
  <td style="background:linear-gradient(135deg,#4f46e5,#9333ea); padding:30px; text-align:center; color:#ffffff;">
    <h1 style="margin:0;">OrbitX MCN</h1>
    <p style="margin:5px 0 0;">Empowering Creators Worldwide</p>
  </td>
</tr>

<!-- Body -->
<tr>
  <td style="padding:30px; color:#333;">
    <h2 style="margin-top:0;">Hello Creator 👋,</h2>
    
    <p>
      We are excited to invite you to join <strong>OrbitX MCN Network</strong> — a powerful platform designed to help creators grow, protect, and monetize their content globally.
    </p>

    <p><strong>Why join OrbitX MCN?</strong></p>
    <ul style="padding-left:20px;">
      <li>💰 Monetization Support & Revenue Growth</li>
      <li>🛡️ Copyright Protection & Claim Management</li>
      <li>📊 Advanced Analytics Dashboard</li>
      <li>🚀 Channel Growth & SEO Optimization</li>
      <li>🤝 Brand Collaboration Opportunities</li>
    </ul>

    <p>
      Take your YouTube channel to the next level with our professional CMS & MCN services.
    </p>

    <!-- Button -->
    <div style="text-align:center; margin:30px 0;">
      <a href="https://media-star-mcn-frho.vercel.app" 
         style="background:#4f46e5; color:#fff; padding:14px 25px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
         Join OrbitX MCN Now
      </a>
    </div>
    
  </td>
</tr>
  </table>
</body>
</html>`,
    variables: ['channelName', 'inviteLink'],
    category: 'invite' as const
  };

  try {
    await EmailTemplate.create(inviteTemplate);
    console.log('Template created successfully');
  } catch (err) {
    console.error('Error creating template:', err);
  } finally {
    process.exit();
  }
};

seed();
