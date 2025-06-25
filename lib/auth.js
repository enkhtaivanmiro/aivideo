import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser as amplifyGetCurrentUser, fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import Cookies from 'js-cookie';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_COGNITO_REGION,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT],
          responseType: 'code',
          providers: ['Google', 'Facebook', 'Apple']
        }
      }
    }
  }
};

Amplify.configure(amplifyConfig);

export const Auth = {
  signIn: async (username, password) => {
    const result = await signIn({ username, password });
    
    if (result.isSignedIn || result.nextStep?.signInStep === 'DONE') {
      const session = await fetchAuthSession();
      const tokens = session.tokens;
      
      if (tokens) {
        const idToken = tokens.idToken?.toString();
        const accessToken = tokens.accessToken?.toString();
        
        if (idToken) Cookies.set('token', idToken, { expires: 7, path: '/' });
        if (idToken) Cookies.set('idToken', idToken, { expires: 7, path: '/' });
        if (accessToken) Cookies.set('accessToken', accessToken, { expires: 7, path: '/' });
      }
    }
    
    return result;
  },

  signOut: async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('Amplify signOut error:', error);
    }
    
    Cookies.remove('token');
    Cookies.remove('idToken');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout API error:', error);
    }
  },

  currentAuthenticatedUser: async () => {
    const token = Cookies.get('token') || Cookies.get('idToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    try {
      return await amplifyGetCurrentUser();
    } catch (error) {
      if (token) {
        return { username: 'user' }; // Placeholder fallback
      }
      throw error;
    }
  },

  currentSession: async () => {
    return await fetchAuthSession();
  },

  federatedSignIn: async ({ provider }) => {
    return await signInWithRedirect({ provider });
  },

  isAuthenticated: () => {
    return !!(Cookies.get('token') || Cookies.get('idToken'));
  }
};

export const getCurrentUser = Auth.currentAuthenticatedUser;
