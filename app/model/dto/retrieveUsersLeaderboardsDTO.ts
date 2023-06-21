import { Avatar } from '../users';

export type LeaderboardPosition = {
  id: string;
  position: number;
  username: string;
  weeklyExp: number;
  totalExp: number;
  avatar: Avatar;
};

export class RetrieveUsersLeaderboardsDTO {
  weekly: LeaderboardPosition[];
  allTime: LeaderboardPosition[];
  updatedAt: Date;
}
