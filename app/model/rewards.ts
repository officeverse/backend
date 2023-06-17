import mongoose from 'mongoose';

export type RewardsDocument = mongoose.Document & {
  name: string;
  description: string;
  category: string;
  cost: number;
  imageKey: string;
  createdAt: Date;
};

const rewardsSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  description: { type: String, trim: true, default: 'No description provided' },
  category: { type: String, trim: true, default: 'Uncategorised' },
  cost: { type: Number, min: 0, max: 100000 },
  imageKey: String,
  createdAt: { type: Date, default: Date.now },
});

export const rewards =
  mongoose.models.rewards ||
  mongoose.model<RewardsDocument>('rewards', rewardsSchema);
