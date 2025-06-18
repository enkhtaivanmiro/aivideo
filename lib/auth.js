import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'ap-northeast-1',
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'ap-northeast-1_WYgTTo7jA',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '2e3iko2tmgo88146l0sqb0nenm',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN || 'ap-northeast-1wygtto7ja.auth.ap-northeast-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/auth'],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/login'],
          responseType: 'code',
        }
      }
    }
  }
};

Amplify.configure(amplifyConfig);

export { signIn, signOut, getCurrentUser, signInWithRedirect, fetchAuthSession } from 'aws-amplify/auth';

export async function getUserGroups() {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    
    if (idToken) {
      const groups = idToken.payload['cognito:groups'] || [];
      return groups;
    }
    return [];
  } catch (error) {
    console.error('Error getting user groups:', error);
    return [];
  }
}

export async function isUserInGroup(groupName) {
  try {
    const groups = await getUserGroups();
    return groups.includes(groupName);
  } catch (error) {
    console.error('Error checking user group:', error);
    return false;
  }
}