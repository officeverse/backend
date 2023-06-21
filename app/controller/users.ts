import { Model } from 'mongoose';
import { UsersService } from '../service/user/api';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { MessageUtil } from '../utils/message';
import { CreateUserDTO } from '../model/dto/createUserDTO';
import { ResetCodeDTO } from '../model/dto/resetCodeDTO';
import { isValidObjectId } from 'mongoose';

export class UsersController extends UsersService {
  constructor(users: Model<any>) {
    super(users);
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
    if (!userId) {
      throw new Error('userId parameter is missing');
    }
    if (!isValidObjectId(userId)) {
      throw new Error('userId parameter is invalid');
    }
    return this.retrieveUserProfile(userId)
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
}
