import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt';
import User from '../models/User';
import { sendEmail } from '../utils/mailer';

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      'Verify Your OrbitX Account',
      `<h1>Welcome, ${name}!</h1>
       <p>Thank you for joining OrbitX Network LTD. Please verify your email by clicking the link below:</p>
       <a href="${verificationUrl}">${verificationUrl}</a>
       <p>Alternatively, you can use this token: <strong>${verificationToken}</strong></p>`
    );

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid verification token' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ success: true, msg: 'Email verified successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

export const resendVerification = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.emailVerified) {
      return res.status(400).json({ success: false, msg: 'User not found or already verified' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    await sendEmail(
      user.email,
      'Verify Your OrbitX Account',
      `<h1>Verify Your Email</h1>
       <p>Please click the link below to verify your email:</p>
       <a href="${verificationUrl}">${verificationUrl}</a>
       <p>Alternatively, you can use this token: <strong>${verificationToken}</strong></p>`
    );

    res.json({ success: true, msg: 'Verification email resent' });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, msg: 'User registered via social login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      'Password Reset Request',
      `<h1>Password Reset Requested</h1>
       <p>You requested a password reset. Use the link below to set a new password:</p>
       <a href="${resetUrl}">${resetUrl}</a>
       <p>Alternatively, use this token in the reset form: <strong>${resetToken}</strong></p>
       <p>This token is valid for 1 hour.</p>`
    );

    res.json({ success: true, msg: 'Password reset email sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, msg: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
