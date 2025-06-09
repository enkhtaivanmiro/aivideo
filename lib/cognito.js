import AWS from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-1_WYgTTo7jA',
  ClientId: '2e3iko2tmgo88146l0sqb0nenm',
};

console.log('UserPoolId:', poolData.UserPoolId);
console.log('ClientId:', poolData.ClientId);

const userPool = new CognitoUserPool(poolData);

AWS.config.region = 'ap-northeast-1';

export { userPool, CognitoUser, AuthenticationDetails };
