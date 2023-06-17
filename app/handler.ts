import { Handler, Context, APIGatewayEvent } from 'aws-lambda';
import { rewards, users } from './model';
import { UsersController } from './controller/users';
import { RewardsController } from './controller/rewards';

const usersController = new UsersController(users);
const rewardsController = new RewardsController(rewards);

// rewards
export const rewardsCreate: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return rewardsController.create(event, context);
};

export const rewardsList: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return rewardsController.list(event, context);
};

// users
export const usersCreate: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.create(event, context);
};
