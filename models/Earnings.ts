import mongoose, { Schema, Document } from 'mongoose';

export interface IEarnings extends Document {
  userId: string;
  channelId: string;
  totalRevenue: number;
  creatorShare: number;
  mcnShare: number;
  bonusPool: number;
  creatorPercentage: number;
  mcnPercentage: number;
  bonusPercentage: number;
  date: Date;
}

const earningsSchema = new Schema<IEarnings>({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  totalRevenue: { type: Number, required: true },
  creatorShare: { type: Number, required: true },
  mcnShare: { type: Number, required: true },
  bonusPool: { type: Number, required: true },
  creatorPercentage: { type: Number, required: true },
  mcnPercentage: { type: Number, required: true },
  bonusPercentage: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IEarnings>('Earnings', earningsSchema);
