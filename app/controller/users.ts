import { Model } from 'mongoose';
import { UsersService } from '../service/users';
import { Context } from 'aws-lambda';
import { MessageUtil } from '../utils/message';
import { CreateUserDTO } from '../model/dto/createUserDTO';

export class UsersController extends UsersService {
  constructor(users: Model<any>) {
    super(users);
  }

  async create(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: CreateUserDTO = JSON.parse(event.body);

    return this.createUser({
      name: params.name,
      dateOfBirth: params.dateOfBirth,
      cognitoId: params.cognitoId,
    })
      .then((res) => MessageUtil.success(res))
      .catch((err) => {
        console.error(err);
        return MessageUtil.error(err.code, err.message);
      });
  }
}
