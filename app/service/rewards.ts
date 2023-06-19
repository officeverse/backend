import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateRewardDTO } from '../model/dto/createRewardDTO';
import { RewardDTO } from '../model/dto/listRewardsDTO';
import { RewardsDocument } from '../model';
import { ListRewardsParams } from '../model/params.types';
import { handler as uploadHandler } from './file/uploadFileToBucket';
import { handler as getFileHandler } from './file/getFileFromBucket';
import { S3_PREFIX_COMPRESS } from '../utils/aws';

export class RewardsService {
  private rewards: Model<any>;
  constructor(rewards: Model<any>) {
    this.rewards = rewards;
  }

  private isAcceptedMimeType(mimeType: string) {
    switch (mimeType) {
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
        return true;
      default:
        return false;
    }
  }

  protected async createReward(params: CreateRewardDTO): Promise<object> {
    const { name, description, category, cost, imageDataUrl } = params;
    const mimeType = imageDataUrl.substring(
      imageDataUrl.indexOf(':') + 1,
      imageDataUrl.indexOf(';')
    );
    if (!this.isAcceptedMimeType(mimeType)) {
      throw new Error('Image type is not supported.');
    }

    const imageKey = `rewards/${uuidv4()}`;
    const uploadData = {
      file: params.imageDataUrl.replace(/^data:image\/\w+;base64,/, ''),
      options: {
        bucket: process.env.FILE_UPLOAD_BUCKET_NAME,
        key: `${S3_PREFIX_COMPRESS}${imageKey}`, // add prefix to trigger compress operation
        contentEncoding: 'base64',
        contentType: mimeType,
      },
    };

    console.info('Uploading image to bucket');
    await uploadHandler({ body: JSON.stringify(uploadData) }).catch((err) => {
      console.error(err);
      throw err;
    });

    console.info('Persisting reward data into database');
    return this.rewards
      .create({ name, description, category, cost, imageKey })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  protected async listRewards(params: ListRewardsParams): Promise<object> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const currentCount = limit + skip;
    const rewardsCount = await this.rewards.countDocuments({});
    const hasNextPage = rewardsCount > currentCount;

    console.info('Fetching data from database');
    const filteredRewards = await this.rewards
      .find()
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit);

    console.info('Fetching images from bucket');
    const rewards: RewardDTO[] = await Promise.all(
      filteredRewards.map(async (reward: RewardsDocument) => {
        const { _id: id, name, description, category, cost, imageKey } = reward;
        const imageDataUrl = await getFileHandler({
          bucket: process.env.FILE_UPLOAD_BUCKET_NAME,
          key: imageKey,
        });

        return { id, name, description, category, cost, imageDataUrl };
      })
    );

    return { hasNextPage, rewards };
  }
}
