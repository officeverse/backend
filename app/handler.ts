import {
  Handler,
  Context,
  APIGatewayEvent,
  PreSignUpTriggerEvent,
  PostConfirmationTriggerEvent,
} from 'aws-lambda';
import { challenges, rewards, users } from './model';
import { ChallengesController } from './controller/challenges';
import { RewardsController } from './controller/rewards';
import { UsersController } from './controller/users';
import { handler as preSignUpValidateCodeHandler } from './service/user/preSignUpValidateCode';
import { handler as onUserSignUpConfirmationHandler } from './service/user/onUserSignUpConfirmation';

const challengesController = new ChallengesController(challenges);
const rewardsController = new RewardsController(rewards);
const usersController = new UsersController(users);

// challenges
export const challengesCreate: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return challengesController.create(event, context);
};

export const challengesList: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return challengesController.list(event, context);
};

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

export const usersResetCode: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.resetCode(event, context);
};

// other lambdas
export const preSignUpValidateCode: Handler = (
  event: PreSignUpTriggerEvent,
  context: Context
) => {
  return preSignUpValidateCodeHandler(event, context);
};

export const onUserSignUpConfirmation: Handler = (
  event: PostConfirmationTriggerEvent,
  context: Context
) => {
  return onUserSignUpConfirmationHandler(event, context);
};
