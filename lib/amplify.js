import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,

    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,

    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,

    oauth: {
      domain: process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN,
      scopes: ['email', 'openid', 'profile'],
      redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
      responseType: 'code', 
    },
  },
};

Amplify.configure(amplifyConfig);
