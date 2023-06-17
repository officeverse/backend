import { APIGatewayEvent, Context } from 'aws-lambda';
import { Model } from 'mongoose';
import { MessageUtil } from '../utils/message';
import { RewardsService } from '../service/rewards.js';
import { RewardsDocument } from '../model/rewards.js';
import { CreateRewardDTO } from '../model/dto/createRewardDTO';

export class RewardsController extends RewardsService {
  constructor(rewards: Model<RewardsDocument>) {
    super(rewards);
  }

  async create(event: APIGatewayEvent, context?: Context) {
    console.log('functionName', context.functionName);

    const params: CreateRewardDTO = JSON.parse(event.body);
    const { name, description, category, cost, imageDataUrl } = params || {};

    return this.createReward({
      name,
      description,
      category,
      cost,
      imageDataUrl,
    })
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async list(event: APIGatewayEvent, context?: Context) {
    console.log('functionName', context.functionName);

    const params = {
      page: +event.queryStringParameters.page,
      limit: +event.queryStringParameters.limit,
    };

    return this.listRewards(params)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }
}
