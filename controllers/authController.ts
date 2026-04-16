import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt';
import User from '../models/User';

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

    // Mock sending email
    console.log(`Sending verification email to ${email}: Token is ${verificationToken}`);

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

    console.log(`Resending verification email to ${user.email}: Token is ${verificationToken}`);

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
