import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
  userId: string;
  amount: number;
  method: string;
  status: string;
  date: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema);
