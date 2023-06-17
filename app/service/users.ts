import { Model } from 'mongoose';
import { CreateUserDTO } from '../model/dto/createUserDTO';

export class UsersService {
  private users: Model<any>;
  constructor(users: Model<any>) {
    this.users = users;
  }

  protected async createUser(params: CreateUserDTO): Promise<object> {
    return this.users
      .create({
        name: params.name,
        dateOfBirth: params.dateOfBirth,
        cognitoId: params.cognitoId,
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }
}
