import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Referral from '../models/Referral';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInvite = async (req: Request, res: Response) => {
  const { channelName, email, message } = req.body;
  
  try {
    const mailOptions = {
      from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <invites@orbitx.com>',
      to: email,
      subject: `Exclusive Invitation to Join OrbitX MCN - ${channelName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0;">OrbitX MCN</h1>
          </div>
          <h2 style="color: #1f2937;">You're Invited!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello <strong>${channelName}</strong> team,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We have been closely following your channel's growth and we are incredibly impressed by the quality of your content. We would love to invite you to join the OrbitX Multi-Channel Network.</p>
          
          ${message ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0; border-radius: 4px;">
            <strong style="color: #374151;">A personal note from our team:</strong><br/><br/>
            <span style="color: #4b5563; font-style: italic;">"${message}"</span>
          </div>` : ''}
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">As part of OrbitX, you'll get access to:</p>
          <ul style="color: #4b5563; font-size: 16px; line-height: 1.5;">
            <li>Premium Content ID protection</li>
            <li>Exclusive brand sponsorship opportunities</li>
            <li>Advanced analytics and AI tools</li>
            <li>Dedicated partner support</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://orbitx-mcn.com/apply" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review Invitation & Apply</a>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We look forward to potentially working together to take your channel to the next level!</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Best regards,<br/><strong>The OrbitX Team</strong></p>
        </div>
      `
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, message: 'Invite sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email invite' });
  }
};

export const getReferrals = async (req: any, res: Response) => {
  try {
    const referrals = await Referral.find({ referrerId: req.user.id });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
};

export const trackReferral = async (req: any, res: Response) => {
  const { referredId } = req.body;
  try {
    const referral = await Referral.create({
      referrerId: req.user.id,
      referredId,
      status: 'active'
    });
    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track referral' });
  }
};
