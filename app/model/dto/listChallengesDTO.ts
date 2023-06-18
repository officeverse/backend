export type ChallengeDTO = {
  id: string;
  name: string;
  description: string;
  reward: number;
  expiresOn: Date;
  imageDataUrl: string;
};

export class ListChallengesDTO {
  hasNextPage: boolean;
  challenges: ChallengeDTO[];
}
