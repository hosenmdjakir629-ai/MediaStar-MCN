import { Request, Response } from 'express';
import User from '../models/User';

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateKYC = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { idType, idNumber, documentUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        kycStatus: 'pending',
        kycData: {
          idType,
          idNumber,
          documentUrl,
          submittedAt: new Date()
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'KYC submitted successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update KYC' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getCreators = async (req: Request, res: Response) => {
  try {
    const creators = await User.find({ role: 'creator' }).select('-password');
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
};
