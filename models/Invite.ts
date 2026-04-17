import mongoose, { Schema, Document } from 'mongoose';

export interface IInvite extends Document {
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
}

const inviteSchema = new Schema<IInvite>({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInvite>('Invite', inviteSchema);
