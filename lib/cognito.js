// lib/cognito.js
// DEPRECATED: Use aws-amplify's Auth module instead
// import AWS from 'aws-sdk';
// import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
//
// const poolData = {
//   UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || 'ap-northeast-1_WYgTTo7jA',
//   ClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID || '2e3iko2tmgo88146l0sqb0nenm',
// };
//
// const userPool = new CognitoUserPool(poolData);
//
// AWS.config.region = 'ap-northeast-1';
//
// export { userPool, CognitoUser, AuthenticationDetails };