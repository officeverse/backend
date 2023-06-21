import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UsersDocument = mongoose.Document & {
  // cognito profile
  cognitoSub: string;
  username: string;
  email: string;
  // basic information
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  jobTitle?: string;
  dateJoined?: Date;
  numMCSRemaining: number;
  numLeavesRemaining: number;
  // additional user data
  hasCompletedOnboarding: boolean;
  totalCoins: number;
  weeklyCoins: number;
  totalExp: number;
  signUpCode: string;
  isSignUpCodeUsed: boolean;
  createdAt: Date;
};

const usersSchema = new mongoose.Schema({
  // cognito profile
  cognitoSub: String,
  username: String,
  email: String,
  // basic information
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true },
  dateOfBirth: { type: Date, required: true },
  jobTitle: { type: String, trim: true, required: true },
  dateJoined: { type: Date, required: true },
  numMCSRemaining: { type: Number, default: 14 },
  numLeavesRemaining: { type: Number, default: 14 },
  // additional user data
  hasCompletedOnboarding: { type: Boolean, default: false },
  totalCoins: { type: Number, default: 0 },
  weeklyCoins: { type: Number, default: 0 },
  totalExp: { type: Number, default: 0 },
  signUpCode: { type: String, default: uuidv4() },
  isSignUpCodeUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const users =
  (mongoose.models.users as mongoose.Model<UsersDocument>) ||
  mongoose.model<UsersDocument>('users', usersSchema);
