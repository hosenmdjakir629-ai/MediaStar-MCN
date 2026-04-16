import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
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

export const notifyApplication = async (req: Request, res: Response) => {
  const { name, email, channelName, status, adminNotes, templateId, templateSubject, templateBody } = req.body;
  try {
    let subject = `OrbitX Application Update: ${status}`;
    let htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Application Status Update</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your application for <strong>${channelName}</strong> has been updated to: <strong style="color: #4f46e5;">${status}</strong>.</p>
          ${adminNotes ? `<div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;"><strong>Admin Notes:</strong><br/>${adminNotes}</div>` : ''}
          <p>If you have any questions, please reply to this email.</p>
          <p>Best regards,<br/>The OrbitX Team</p>
        </div>
      `;

    if (templateSubject && templateBody) {
      subject = templateSubject
        .replace(/{{channelName}}/g, channelName)
        .replace(/{{status}}/g, status);
      
      htmlBody = templateBody
        .replace(/{{channelName}}/g, channelName)
        .replace(/{{name}}/g, name)
        .replace(/{{status}}/g, status)
        .replace(/{{adminNotes}}/g, adminNotes || '');
    }

    const mailOptions = {
      from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <notifications@orbitx.com>',
      to: email,
      subject: subject,
      html: htmlBody
    };
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false });
  }
};

export const notifyPayout = async (req: Request, res: Response) => {
  const { email, name, amount, method, status, reference, templateId, templateSubject, templateBody } = req.body;
  try {
    let subject = `OrbitX Payout Update: ${status}`;
    let htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Payout Status Update</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your withdrawal request for <strong>$${amount}</strong> via <strong>${method}</strong> has been updated to: <strong style="color: #4f46e5;">${status}</strong>.</p>
          ${reference ? `<p><strong>Reference:</strong> ${reference}</p>` : ''}
          <p>If you have any questions, please reply to this email.</p>
          <p>Best regards,<br/>The OrbitX Team</p>
        </div>
      `;

    if (templateSubject && templateBody) {
      subject = templateSubject
        .replace(/{{status}}/g, status)
        .replace(/{{amount}}/g, amount.toString());
      
      htmlBody = templateBody
        .replace(/{{name}}/g, name)
        .replace(/{{amount}}/g, amount.toString())
        .replace(/{{method}}/g, method)
        .replace(/{{status}}/g, status)
        .replace(/{{reference}}/g, reference || '');
    }

    const mailOptions = {
      from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <finance@orbitx.com>',
      to: email,
      subject: subject,
      html: htmlBody
    };
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false });
  }
};

export const notifyCopyright = async (req: Request, res: Response) => {
  const { email, name, videoTitle, claimant, matchType, templateId, templateSubject, templateBody } = req.body;
  try {
    let subject = `Urgent: Copyright Claim Detected - ${videoTitle}`;
    let htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ef4444; border-radius: 8px;">
          <h2 style="color: #ef4444;">Copyright Claim Notification</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Our system has detected a copyright claim on your video: <strong>${videoTitle}</strong>.</p>
          <div style="background: #fee2e2; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Claimant:</strong> ${claimant}</p>
            <p><strong>Match Type:</strong> ${matchType}</p>
          </div>
          <p>Please log in to your dashboard to review the claim and take necessary action.</p>
          <p>Best regards,<br/>The OrbitX Legal Team</p>
        </div>
      `;

    if (templateSubject && templateBody) {
      subject = templateSubject
        .replace(/{{videoTitle}}/g, videoTitle);
      
      htmlBody = templateBody
        .replace(/{{name}}/g, name)
        .replace(/{{videoTitle}}/g, videoTitle)
        .replace(/{{claimant}}/g, claimant)
        .replace(/{{matchType}}/g, matchType);
    }

    const mailOptions = {
      from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <legal@orbitx.com>',
      to: email,
      subject: subject,
      html: htmlBody
    };
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false });
  }
};
