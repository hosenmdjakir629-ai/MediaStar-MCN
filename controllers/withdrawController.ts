import { Request, Response } from 'express';
import Withdrawal from '../models/Withdrawal';

export const getMyWithdrawals = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const withdrawals = await Withdrawal.find({ userId });
    res.json(withdrawals);
  } catch (error) {
    console.error('Error in getMyWithdrawals:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const requestWithdraw = async (req: any, res: Response) => {
  try {
    const { amount, method } = req.body;
    const userId = req.user.id;

    const withdrawal = await Withdrawal.create({
      userId,
      amount,
      method,
      status: 'pending',
      date: new Date()
    });

    res.json({ success: true, withdrawal });
  } catch (error) {
    console.error('Error in requestWithdraw:', error);
    res.status(500).json({ error: 'Failed to request withdrawal' });
  }
};

export const calculateWithdrawalFees = async (req: Request, res: Response) => {
  try {
    const { amount, method } = req.body;
    // Mock fee calculation
    const fee = amount * 0.02; // 2% fee
    const processingTime = method === 'Bank Transfer' ? '3-5 business days' : '1-2 business days';
    
    res.json({
      amount,
      method,
      fee,
      totalToReceive: amount - fee,
      processingTime
    });
  } catch (error) {
    console.error('Error in calculateWithdrawalFees:', error);
    res.status(500).json({ error: 'Failed to calculate fees' });
  }
};

export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const data = await Withdrawal.find();
    res.json(data);
  } catch (error) {
    console.error('Error in getWithdrawals:', error);
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
