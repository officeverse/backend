import { Avatar } from '../users';

export class UserProfileDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  numMCSRemaining: number;
  numLeavesRemaining: number;
  totalExp: string;
  weeklyExp: string;
  coins: string;
  badges: string[];
  hasCompletedOnboarding: boolean;
  avatar: Avatar;
}
