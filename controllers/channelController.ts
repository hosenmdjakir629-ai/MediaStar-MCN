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

export const syncChannel = async (req: any, res: Response) => {
  try {
    const { channelId } = req.body;
    const userId = req.user.id;

    // In a real app, you'd fetch data from YouTube API here
    // For now, we'll simulate a sync by updating with random growth
    const channel = await Channel.findOne({ channelId, userId });
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Simulate growth
    channel.views += Math.floor(Math.random() * 1000);
    channel.subscribers += Math.floor(Math.random() * 10);
    channel.revenue += Math.random() * 50;
    
    await channel.save();

    res.json({
      views: channel.views,
      subscribers: channel.subscribers,
      videos: 42, // Mocked video count
      revenue: channel.revenue
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync channel' });
  }
};
