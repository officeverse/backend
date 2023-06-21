import { Context, ScheduledEvent } from 'aws-lambda';
import { users } from '../../model';

export const handler = async (event: ScheduledEvent, context: Context) => {
  console.log('functionName', context.functionName);
  return users
    .updateMany({}, { weeklyExp: 0 })
    .then(() => {
      console.log('Successfully reset weeklyExp');
      return event;
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Error resetting leaderboards');
    });
};
