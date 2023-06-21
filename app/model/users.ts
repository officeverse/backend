import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type Avatar = {
  fit: number;
  glasses: number;
  hair: number;
  base: number;
};

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
  coins: number;
  weeklyExp: number;
  totalExp: number;
  signUpCode: string;
  isSignUpCodeUsed: boolean;
  badges: string[];
  avatar: Avatar;
  createdAt: Date;
};

const usersSchema = new mongoose.Schema({
  // cognito profile
  cognitoSub: String,
  username: String,
  email: String,
  // basic information
  firstName: { type: String, trim: true, default: '' },
  lastName: { type: String, trim: true, default: '' },
  dateOfBirth: { type: Date, default: Date.now },
  jobTitle: { type: String, trim: true, default: '' },
  dateJoined: { type: Date, default: Date.now },
  numMCSRemaining: { type: Number, default: 14 },
  numLeavesRemaining: { type: Number, default: 14 },
  // additional user data
  hasCompletedOnboarding: { type: Boolean, default: false },
  coins: { type: Number, default: 0 },
  weeklyExp: { type: Number, default: 0 },
  totalExp: { type: Number, default: 0 },
  badges: { type: Array<String>, default: [] },
  signUpCode: { type: String, default: uuidv4() },
  isSignUpCodeUsed: { type: Boolean, default: false },
  avatar: {
    type: Object,
    default: {
      fit: 1,
      glasses: 1,
      hair: 1,
      base: 1,
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export const users =
  (mongoose.models.users as mongoose.Model<UsersDocument>) ||
  mongoose.model<UsersDocument>('users', usersSchema);
