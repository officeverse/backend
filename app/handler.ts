import { Handler, Context } from 'aws-lambda';
import { users } from './model';
import { UsersController } from './controller/users';

const usersController = new UsersController(users);

export const usersCreate: Handler = (event: any, context: Context) => {
  return usersController.create(event, context);
};
