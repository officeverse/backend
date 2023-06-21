import { Model } from 'mongoose';
import { CreateUserDTO } from '../../model/dto/createUserDTO';
import { ResetCodeDTO } from '../../model/dto/resetCodeDTO';
import { AddUserExpResponseDTO } from '../../model/dto/addUserExpResponseDTO';
import { UpdateUserCoinsResponseDTO } from '../../model/dto/updateUserCoinsResponseDTO';
import { UsersDocument } from '../../model';
import { UpdateUserAvatarDTO } from '../../model/dto/updateUserAvatarDTO';
import {
  LeaderboardPosition,
  RetrieveUsersLeaderboardsDTO,
} from '../../model/dto/retrieveUsersLeaderboardsDTO';

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

  protected async retrieveUserProfile(userId: string): Promise<object> {
    return this.users
      .findOne({ _id: userId })
      .then((user) => {
        if (!user) throw new Error('User ID does not exist!');
        const {
          username,
          firstName,
          lastName,
          jobTitle,
          numMCSRemaining,
          numLeavesRemaining,
          totalExp,
          weeklyExp,
          coins,
          badges,
          avatar,
          hasCompletedOnboarding,
        } = user;
        return {
          userId,
          username,
          firstName,
          lastName,
          jobTitle,
          numMCSRemaining,
          numLeavesRemaining,
          totalExp,
          weeklyExp,
          coins,
          badges,
          avatar,
          hasCompletedOnboarding,
        };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  protected async retrieveUsersLeaderboards(): Promise<RetrieveUsersLeaderboardsDTO> {
    const weeklyLeaderboards: LeaderboardPosition[] = await this.users
      .find({ weeklyExp: { $gt: 0 } })
      .sort({ weeklyExp: -1 })
      .limit(5)
      .then((users: UsersDocument[]) =>
        users.map((user, i) => {
          const { id, username, weeklyExp, totalExp, avatar } = user;
          return {
            id,
            position: i + 1,
            username,
            weeklyExp,
            totalExp,
            avatar,
          };
        })
      );

    const allTimeLeaderboards: LeaderboardPosition[] = await this.users
      .find({ totalExp: { $gt: 0 } })
      .sort({ totalExp: -1 })
      .limit(10)
      .then((users: UsersDocument[]) =>
        users.map((user, i) => {
          const { id, username, weeklyExp, totalExp, avatar } = user;
          return {
            id,
            position: i + 1,
            username,
            weeklyExp,
            totalExp,
            avatar,
          };
        })
      );

    return {
      weekly: weeklyLeaderboards,
      allTime: allTimeLeaderboards,
      updatedAt: new Date(),
    };
  }

  protected async updateUserCoins(
    userId: string,
    value: number
  ): Promise<UpdateUserCoinsResponseDTO> {
    return this.users
      .findOneAndUpdate(
        { _id: userId },
        {
          $inc: { coins: value },
        },
        {
          returnDocument: 'after',
        }
      )
      .then((user) => {
        if (!user) throw new Error('Invalid userId.');
        const { coins } = user;
        return { userId, coins };
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  protected async addUserExp(
    userId: string,
    value: number
  ): Promise<AddUserExpResponseDTO> {
    return this.users
      .findOneAndUpdate(
        { _id: userId },
        {
          $inc: { totalExp: value, weeklyExp: value },
        },
        {
          returnDocument: 'after',
        }
      )
      .then((user) => {
        if (!user) throw new Error('Invalid userId.');
        const { totalExp, weeklyExp } = user;
        return { userId, totalExp, weeklyExp };
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  protected async updateUserAvatar(
    userId: string,
    avatar: UpdateUserAvatarDTO
  ): Promise<object> {
    const { fit, glasses, hair, base } = avatar;
    const updateObject = {
      ...(fit && { 'avatar.fit': fit }),
      ...(glasses && { 'avatar.glasses': glasses }),
      ...(hair && { 'avatar.hair': hair }),
      ...(base && { 'avatar.base': base }),
    };

    return this.users
      .findOneAndUpdate({ _id: userId }, updateObject, {
        returnDocument: 'after',
      })
      .then((user) => {
        if (!user) throw new Error('Invalid userId.');
        const { avatar } = user;
        return { userId, avatar };
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }
}
