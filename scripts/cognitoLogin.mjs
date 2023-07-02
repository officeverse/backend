import { createHmac } from 'crypto';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const {
  AWS_REGION,
  COGNITO_CLIENT_ID_DEV,
  COGNITO_CLIENT_SECRET_DEV,
  COGNITO_JWT_USERNAME,
  COGNITO_JWT_PASSWORD,
} = process.env;

// compute client secret hash
const client = new CognitoIdentityProviderClient({ region: AWS_REGION });
const hasher = createHmac('sha256', COGNITO_CLIENT_SECRET_DEV);
hasher.update(`${COGNITO_JWT_USERNAME}${COGNITO_CLIENT_ID_DEV}`);
const secretHash = hasher.digest('base64');

const initiateInput = {
  AuthFlow: 'USER_PASSWORD_AUTH',
  AuthParameters: {
    USERNAME: COGNITO_JWT_USERNAME,
    PASSWORD: COGNITO_JWT_PASSWORD,
    SECRET_HASH: secretHash,
  },
  ClientId: COGNITO_CLIENT_ID_DEV,
};

client
  .send(new InitiateAuthCommand(initiateInput))
  .then((response) => response.AuthenticationResult)
  .then((authResult) => console.log(authResult))
  .catch((error) => console.error(error));
