import { Request, Response } from 'express';
import User from '../models/User';
import Channel from '../models/Channel';
import Withdrawal from '../models/Withdrawal';
import Earnings from '../models/Earnings';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChannels = await Channel.countDocuments();
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    
    const totalEarnings = await Earnings.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalChannels,
      pendingWithdrawals,
      totalRevenue: totalEarnings[0]?.total || 0,
      systemStatus: 'Healthy'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
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

export const updateWithdrawalStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(id, { status }, { new: true });
    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update withdrawal status' });
  }
};

export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find().populate('userId');
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const getAllCreators = async (req: Request, res: Response) => {
  // Placeholder: Implement creator fetching logic
  res.json({ message: 'Not implemented' });
};

export const getSystemLogs = async (req: Request, res: Response) => {
  // Placeholder: Implement log fetching logic
  res.json({ message: 'Not implemented' });
};

export const getFraudAlerts = async (req: Request, res: Response) => {
  // Placeholder: Implement fraud alert fetching logic
  res.json({ message: 'Not implemented' });
};

export const getManualOverrides = async (req: Request, res: Response) => {
  // Placeholder: Implement manual override fetching logic
  res.json({ message: 'Not implemented' });
};
