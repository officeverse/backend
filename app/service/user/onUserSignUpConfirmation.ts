import { Context, PostConfirmationTriggerEvent } from 'aws-lambda';
import { users } from '../../model';

export const handler = async (
  event: PostConfirmationTriggerEvent,
  context: Context
) => {
  console.log('functionName', context.functionName);
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') return;
  const { userName: username } = event;
  const { userAttributes } = event.request;
  const { email, sub, 'custom:sign_up_code': signUpCode } = userAttributes;

  // sign up without a code
  if (signUpCode === process.env.BYPASS_SIGN_UP_CODE) {
    return users
      .create({ username, email, cognitoSub: sub, isSignUpCodeUsed: true })
      .then(() => {
        return event;
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Error occurred during sign up' + err);
      });
  }

  // sign up code is checked in preSignUpValidateCode, assume valid
  return users
    .updateOne(
      { signUpCode },
      { username, email, cognitoSub: sub, isSignUpCodeUsed: true }
    )
    .then(() => {
      return event;
    })
    .catch((err) => {
      console.error(err);
      throw new Error('Error occurred during sign up' + err);
    });
};
