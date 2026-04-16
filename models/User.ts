import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  channelId?: string;
  password?: string;
  role: 'admin' | 'manager' | 'creator';
  photoURL?: string;
  createdAt: Date;
  emailVerified: boolean;
  verificationToken?: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'none';
  kycData?: {
    idType: string;
    idNumber: string;
    documentUrl: string;
    submittedAt: Date;
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  channelId: { type: String },
  password: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'creator'], default: 'creator' },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected', 'none'], default: 'none' },
  kycData: {
    idType: String,
    idNumber: String,
    documentUrl: String,
    submittedAt: Date
  }
});

export default mongoose.model<IUser>('User', userSchema);
