import { Context, PreSignUpTriggerEvent } from 'aws-lambda';
import { users } from '../../model';

export const handler = async (
  event: PreSignUpTriggerEvent,
  context: Context
) => {
  console.log('functionName', context.functionName);
  const { 'custom:sign_up_code': signUpCode } = event.request.userAttributes;

  // bypass database check
  if (signUpCode && signUpCode === process.env.BYPASS_SIGN_UP_CODE) {
    console.log('Bypasing sign up code check');
    return event;
  }

  return users
    .findOne({ signUpCode })
    .then((data) => {
      if (!data) throw new Error('Invalid sign up code.');
      if (data.isSignUpCodeUsed) throw new Error('Sign up code is used.');
      // code will be marked as used after user signs up successfully
      console.log(`Code ${signUpCode} is valid`);
      return event;
    })
    .catch((err) => {
      console.log(`Code ${signUpCode} is invalid`);
      console.error(err);
      throw err;
    });
};
