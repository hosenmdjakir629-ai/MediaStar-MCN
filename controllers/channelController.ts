import { Request, Response } from 'express';
import Channel from '../models/Channel';

export const getMyChannels = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const channels = await Channel.find({ userId });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};

export const linkChannel = async (req: any, res: Response) => {
  try {
    const { channelId, title, subscribers, views, revenue } = req.body;
    const userId = req.user.id;

    const channel = await Channel.create({
      userId,
      channelId,
      title,
      subscribers,
      views,
      revenue,
      linkedAt: new Date(),
      status: 'active'
    });

    res.json({ success: true, channel });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Channel already linked' });
    }
    res.status(500).json({ error: 'Failed to link channel' });
  }
};
