import mongoose from 'mongoose';

export type UsersDocument = mongoose.Document & {
  name: string;
  cognitoId: string;
  createdAt: Date;
  dateOfBirth: Date;
};

const usersSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  cognitoId: String,
  createdAt: { type: Date, default: Date.now },
  dateOfBirth: Date,
});

export const users =
  mongoose.models.users || mongoose.model<UsersDocument>('users', usersSchema);
