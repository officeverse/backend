import mongoose from 'mongoose';

export type ChallengesDocument = mongoose.Document & {
  name: string;
  description: string;
  reward: number;
  expiresOn: Date;
  imageKey: string;
};

const challengesSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  description: { type: String, trim: true, default: 'No description provided' },
  reward: { type: Number, min: 0, max: 100000 },
  imageKey: String,
  expiresOn: Date,
  createdAt: { type: Date, default: Date.now },
});

export const challenges =
  mongoose.models.challenges ||
  mongoose.model<ChallengesDocument>('challenges', challengesSchema);
