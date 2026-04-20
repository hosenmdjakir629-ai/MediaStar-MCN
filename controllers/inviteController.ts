import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { adminDb, adminAuth } from '../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'invites';

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
    
    console.log("Attempting to add invite to Firestore...");
    await adminDb.collection(COLLECTION).add({
        email,
        token,
        status: 'pending',
        createdAt: FieldValue.serverTimestamp()
    });
    console.log("Invite added to Firestore successfully.");

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
    const snapshot = await adminDb.collection(COLLECTION).where('token', '==', token).where('status', '==', 'pending').get();

    if (!snapshot.empty) {
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
    const snapshot = await adminDb.collection(COLLECTION).where('token', '==', token).where('status', '==', 'pending').get();

    if (snapshot.empty) {
      return res.status(400).send("Invalid or expired token");
    }

    const inviteDoc = snapshot.docs[0];
    const inviteData = inviteDoc.data();

    // Create user in firebase auth
    console.log("Attempting to create user...");
    const userRecord = await adminAuth.createUser({
        email: inviteData.email,
        password: password,
        displayName: name
    });
    console.log("User created, UID:", userRecord.uid);
    
    // Create user in firestore 'users' collection
    console.log("Attempting to create user document in Firestore...");
    await adminDb.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: inviteData.email,
        name,
        role: 'creator',
        emailVerified: true
    });
    console.log("User document created.");

    // Update invite status
    console.log("Updating invite status...");
    await inviteDoc.ref.update({ status: 'accepted' });

    res.json({ success: true, message: 'Account created!', user: {uid: userRecord.uid} });
  } catch (error) {
    console.error("Accept invite error details:", error);
    res.status(500).json({ error: 'Failed to create account', details: error instanceof Error ? error.message : String(error) });
  }
};

export const getReferrals = async (req: any, res: Response) => {
    // Referrals logic not strictly needed right now given the user asked for Invite system, 
    // keeping it simple for now, can omit if not used, or refactor to firestore
    res.status(501).json({ error: 'Not implemented' });
};

export const trackReferral = async (req: any, res: Response) => {
    // Referrals logic
    res.status(501).json({ error: 'Not implemented' });
};
