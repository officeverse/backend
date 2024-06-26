import {
  Handler,
  Context,
  APIGatewayEvent,
  PreSignUpTriggerEvent,
  PostConfirmationTriggerEvent,
  ScheduledEvent,
} from 'aws-lambda';
import { challenges, rewards, users } from './model';
import { ChallengesController } from './controller/challenges';
import { RewardsController } from './controller/rewards';
import { UsersController } from './controller/users';
import { handler as preSignUpValidateCodeHandler } from './service/user/preSignUpValidateCode';
import { handler as onUserSignUpConfirmationHandler } from './service/user/onUserSignUpConfirmation';
import { handler as resetWeeklyLeaderboardsHandler } from './service/user/resetWeeklyLeaderboards';
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

export const usersRetrieveProfile: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.retrieveProfile(event, context);
};

export const usersRetrieveLeaderboards: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.retrieveLeaderboards(event, context);
};

export const usersResetCode: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.resetCode(event, context);
};

export const usersUpdateCoins: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.updateCoins(event, context);
};

export const usersAddExp: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.addExp(event, context);
};

export const usersUpdateAvatar: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  return usersController.updateAvatar(event, context);
};

export const usersResetWeeklyLeaderboards: Handler = (
  event: ScheduledEvent,
  context: Context
) => {
  return resetWeeklyLeaderboardsHandler(event, context);
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
