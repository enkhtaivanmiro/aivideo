import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export default client;

