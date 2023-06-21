import { Model } from 'mongoose';
import { CreateUserDTO } from '../../model/dto/createUserDTO';
import { ResetCodeDTO } from '../../model/dto/resetCodeDTO';

export class UsersService {
  private users: Model<any>;
  constructor(users: Model<any>) {
    this.users = users;
  }

  protected async createUser(params: CreateUserDTO): Promise<object> {
    return this.users.create(params).catch((err) => {
      console.error(err);
      throw err;
    });
  }

  protected async resetSignUpCode(params: ResetCodeDTO): Promise<object> {
    const { code } = params;
    return this.users
      .updateOne(
        { signUpCode: code },
        {
          username: '',
          email: '',
          cognitoSub: '',
          isSignUpCodeUsed: false,
        }
      )
      .then((result) => {
        if (!result.modifiedCount) throw new Error('Invalid code.');
        return result;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }
}
