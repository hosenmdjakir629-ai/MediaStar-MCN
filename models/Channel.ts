import mongoose, { Schema, Document } from 'mongoose';

export interface IChannel extends Document {
  userId: string;
  channelId: string;
  title: string;
  subscribers: number;
  views: number;
  revenue: number;
  linkedAt: Date;
  status: 'active' | 'suspended';
}

const channelSchema = new Schema<IChannel>({
  userId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subscribers: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  linkedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' }
});

export default mongoose.model<IChannel>('Channel', channelSchema);
