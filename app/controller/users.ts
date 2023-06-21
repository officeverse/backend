import { Model } from 'mongoose';
import { UsersService } from '../service/user/api';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { MessageUtil } from '../utils/message';
import { CreateUserDTO } from '../model/dto/createUserDTO';
import { ResetCodeDTO } from '../model/dto/resetCodeDTO';
import { isValidObjectId } from 'mongoose';
import { AddUserExpRequestDTO } from '../model/dto/addUserExpRequestDTO';
import { UpdateUserCoinsRequestDTO } from '../model/dto/updateUserCoinsRequestDTO';
import { UpdateUserAvatarDTO } from '../model/dto/updateUserAvatarDTO';

export class UsersController extends UsersService {
  constructor(users: Model<any>) {
    super(users);
  }

  checkValidUserId(userId: string) {
    if (!userId) {
      throw new Error('userId parameter is missing');
    }
    if (!isValidObjectId(userId)) {
      throw new Error('userId parameter is invalid');
    }
  }

  checkValidAvatarValue(avatar: object) {
    Object.entries(avatar).map(([_, value]) => {
      if (value <= 0) throw new Error(`Invalid avatar value ${value}`);
    });
  }

  async create(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);
    const params: CreateUserDTO = JSON.parse(event.body);

    return this.createUser(params)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async retrieveProfile(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);
    const { userId } = event.queryStringParameters;
    this.checkValidUserId(userId);

    return this.retrieveUserProfile(userId)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async retrieveLeaderboards(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);

    return this.retrieveUsersLeaderboards()
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async resetCode(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);
    const params: ResetCodeDTO = JSON.parse(event.body);

    return this.resetSignUpCode(params)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async updateCoins(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);
    const params: UpdateUserCoinsRequestDTO = JSON.parse(event.body);

    console.log(event);
    const { userId } = event.pathParameters;
    const { coins } = params; // not validated
    this.checkValidUserId(userId);

    return this.updateUserCoins(userId, +coins)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async addExp(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);
    const params: AddUserExpRequestDTO = JSON.parse(event.body);

    const { userId } = event.pathParameters;
    const { exp } = params; // not validated
    this.checkValidUserId(userId);
    if (exp <= 0) throw new Error('exp should be a positive integer.');

    return this.addUserExp(userId, exp)
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }

  async updateAvatar(event: APIGatewayEvent, context: Context) {
    console.log('functionName', context.functionName);
    const params: UpdateUserAvatarDTO = JSON.parse(event.body);

    const { userId } = event.pathParameters;
    const { fit, glasses, hair, base } = params;
    this.checkValidUserId(userId);
    this.checkValidAvatarValue({ fit, glasses, hair, base });

    return this.updateUserAvatar(userId, { fit, glasses, hair, base })
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }
}
