import { APIGatewayEvent, Context } from 'aws-lambda';
import { Model } from 'mongoose';
import { MessageUtil } from '../utils/message';
import { ChallengesService } from '../service/challenges.js';
import { ChallengesDocument } from '../model/challenges.js';
import { CreateChallengeDTO } from '../model/dto/createChallengeDTO';

export class ChallengesController extends ChallengesService {
  constructor(challenges: Model<ChallengesDocument>) {
    super(challenges);
  }

  async create(event: APIGatewayEvent, context?: Context) {
    console.log('functionName', context.functionName);

    const params: CreateChallengeDTO = JSON.parse(event.body);
    const { name, description, reward, expiresOn, imageDataUrl } = params || {};

    return this.createChallenge({
      name,
      description,
      reward,
      expiresOn,
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

    return this.listChallenges(params)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }
}
