import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateChallengeDTO } from '../model/dto/createChallengeDTO';
import { ChallengeDTO } from '../model/dto/listChallengesDTO';
import { ChallengesDocument } from '../model';
import { ListChallengesParams } from '../model/params.types';
import { handler as uploadHandler } from './file/uploadFileToBucket';
import { handler as getFileHandler } from './file/getFileFromBucket';
import { S3_PREFIX_COMPRESS } from '../utils/aws';

export class ChallengesService {
  private challenges: Model<any>;
  constructor(challenges: Model<any>) {
    this.challenges = challenges;
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

  protected async createChallenge(params: CreateChallengeDTO): Promise<object> {
    const { name, description, reward, expiresOn, imageDataUrl } = params;
    const mimeType = imageDataUrl.substring(
      imageDataUrl.indexOf(':') + 1,
      imageDataUrl.indexOf(';')
    );
    if (!this.isAcceptedMimeType(mimeType)) {
      throw new Error('Image type is not supported.');
    }

    const imageKey = `challenges/${uuidv4()}`;
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

    console.info('Persisting challenge data into database');
    return this.challenges
      .create({ name, description, reward, expiresOn, imageKey })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  protected async listChallenges(
    params: ListChallengesParams
  ): Promise<object> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const currentCount = limit + skip;
    const challengesCount = await this.challenges.countDocuments({});
    const hasNextPage = challengesCount > currentCount;

    console.info('Fetching data from database');
    const filteredChallenges = await this.challenges
      .find()
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit);

    console.info('Fetching images from bucket');
    const challenges: ChallengeDTO[] = await Promise.all(
      filteredChallenges.map(async (challenge: ChallengesDocument) => {
        const {
          _id: id,
          name,
          description,
          reward,
          expiresOn,
          imageKey,
        } = challenge;
        const imageDataUrl = await getFileHandler({
          bucket: process.env.FILE_UPLOAD_BUCKET_NAME,
          key: imageKey,
        });

        return { id, name, description, reward, expiresOn, imageDataUrl };
      })
    );

    return { hasNextPage, challenges };
  }
}
