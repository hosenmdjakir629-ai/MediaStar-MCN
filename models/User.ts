import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'creator';
  photoURL?: string;
  createdAt: Date;
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
  password: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'creator'], default: 'creator' },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected', 'none'], default: 'none' },
  kycData: {
    idType: String,
    idNumber: String,
    documentUrl: String,
    submittedAt: Date
  }
});

export default mongoose.model<IUser>('User', userSchema);
