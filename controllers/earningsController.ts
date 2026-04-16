import { Request, Response } from 'express';
import Earnings from '../models/Earnings';

export const getMyEarnings = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const earnings = await Earnings.find({ userId });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};

export const addEarning = async (req: Request, res: Response) => {
  try {
    const { 
      userId,
      creatorId, 
      channelId, 
      totalRevenue, 
      creatorPercentage = 70, 
      mcnPercentage = 20, 
      bonusPercentage = 10 
    } = req.body;

    const targetUserId = userId || creatorId;

    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID or Creator ID is required' });
    }

    // Split Engine Logic
    const creatorShare = (totalRevenue * creatorPercentage) / 100;
    const mcnShare = (totalRevenue * mcnPercentage) / 100;
    const bonusPool = (totalRevenue * bonusPercentage) / 100;

    const data = await Earnings.create({
      userId: targetUserId,
      channelId,
      totalRevenue,
      creatorShare,
      mcnShare,
      bonusPool,
      creatorPercentage,
      mcnPercentage,
      bonusPercentage
    });

    res.status(201).json(data);
  } catch (error) {
    console.error('Add earning error:', error);
    res.status(500).json({ error: 'Failed to add earning' });
  }
};

export const getEarnings = async (req: Request, res: Response) => {
  try {
    const data = await Earnings.find({ userId: req.params.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};

export const getNetworkEarnings = async (req: Request, res: Response) => {
  try {
    const earnings = await Earnings.find();
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network earnings' });
  }
};
