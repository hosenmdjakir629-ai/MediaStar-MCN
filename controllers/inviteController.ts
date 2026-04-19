import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Referral from '../models/Referral';
import Invite from '../models/Invite';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { adminDb } from '../lib/firebaseAdmin';

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
  const { channelName, email, message, templateId, templateSubject, templateBody } = req.body;
  
  try {
    const token = crypto.randomBytes(32).toString('hex');
    await Invite.create({ email, token, status: 'pending' });

    const inviteLink = `${process.env.FRONTEND_URL || 'https://media-star-mcn-frho.vercel.app'}/invite?token=${token}`;

    let subject = `Exclusive Invitation to Join OrbitX MCN - ${channelName}`;
    let htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0;">OrbitX MCN</h1>
          </div>
          <h2 style="color: #1f2937;">You're Invited!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello <strong>${channelName}</strong> team,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We would love to invite you to join the OrbitX Multi-Channel Network.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation</a>
          </div>
        </div>
      `;

    if (templateSubject && templateBody) {
      subject = templateSubject.replace(/{{channelName}}/g, channelName);
      htmlBody = templateBody
        .replace(/{{channelName}}/g, channelName)
        .replace(/{{message}}/g, message || '')
        .replace(/{{inviteLink}}/g, inviteLink);
    }

    const mailOptions = {
      from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <invites@orbitx.com>',
      to: email,
      subject: subject,
      html: htmlBody
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, message: 'Invite sent successfully' });
  } catch (error) {
    console.error("Failed to send invite:", error);
    res.status(500).json({ success: false, message: 'Failed to send email invite', error: error instanceof Error ? error.message : String(error) });
  }
};

export const verifyInvite = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  try {
    const invite = await Invite.findOne({ token, status: 'pending' });

    if (invite) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify invite' });
  }
};

export const acceptInvite = async (req: Request, res: Response) => {
  const { token, name, password } = req.body;

  try {
    const invite = await Invite.findOne({ token, status: 'pending' });

    if (!invite) {
      return res.status(400).send("Invalid or expired token");
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: invite.email,
      name,
      password: hashedPassword,
      role: 'creator',
      emailVerified: true // Auto verify as they joined via invite
    });

    // Update invite status
    invite.status = 'accepted';
    await invite.save();

    res.json({ success: true, message: 'Account created!', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
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
