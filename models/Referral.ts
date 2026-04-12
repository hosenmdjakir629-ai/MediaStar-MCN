import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrerId: string;
  referredId: string;
  status: 'pending' | 'active';
  commissionRate: number;
  totalEarned: number;
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referrerId: { type: String, required: true },
  referredId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active'], default: 'pending' },
  commissionRate: { type: Number, default: 0.1 }, // 10% commission
  totalEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReferral>('Referral', referralSchema);
