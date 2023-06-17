export type RewardDTO = {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  imageDataUrl: string;
};

export class ListRewardsDTO {
  hasNextPage: boolean;
  rewards: RewardDTO[];
}
