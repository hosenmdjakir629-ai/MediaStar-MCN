import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue extends Document {
  userId: string;
  videoId: string;
  issueType: string;
  title: string;
  createdAt: Date;
}

const issueSchema = new Schema<IIssue>({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  issueType: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IIssue>('Issue', issueSchema);
