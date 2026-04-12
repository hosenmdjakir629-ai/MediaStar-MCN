import { Request, Response } from 'express';
import Withdrawal from '../models/Withdrawal';

export const getMyWithdrawals = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const withdrawals = await Withdrawal.find({ userId });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const requestWithdraw = async (req: Request, res: Response) => {
  try {
    const data = await Withdrawal.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request withdrawal' });
  }
};

export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const data = await Withdrawal.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const updateWithdrawalStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    res.json({ success: true, withdrawal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update withdrawal status' });
  }
};
