import { Request, Response } from 'express';
import Earnings from '../models/Earnings';
import Channel from '../models/Channel';

export const getChannelAnalytics = async (req: any, res: Response) => {
  const { channelId } = req.params;
  try {
    const earnings = await Earnings.find({ channelId }).sort({ date: 1 });
    const channel = await Channel.findOne({ channelId });
    
    res.json({
      channel,
      earningsHistory: earnings,
      performance: {
        totalViews: channel?.views || 0,
        totalSubscribers: channel?.subscribers || 0,
        totalRevenue: channel?.revenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getGlobalAnalytics = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const earnings = await Earnings.find({ userId }).sort({ date: 1 });
    
    res.json({
      totalEarnings: earnings.reduce((sum, e) => sum + e.totalRevenue, 0),
      history: earnings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global analytics' });
  }
};
