import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'invite' | 'application' | 'payout' | 'general';
  createdAt: Date;
  updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: { type: [String], default: [] },
  category: { 
    type: String, 
    enum: ['invite', 'application', 'payout', 'general'], 
    default: 'general' 
  },
}, { timestamps: true });

export default mongoose.model<IEmailTemplate>('EmailTemplate', emailTemplateSchema);
