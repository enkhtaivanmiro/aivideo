// lib/amplify.js
export async function configureAmplify() {
  try {
    const { Amplify } = await import('aws-amplify');
    console.log('Amplify module:', Amplify); // Debug
    
    const config = {
      Auth: {
        Cognito: {
          region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-1',
          userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || 'ap-northeast-1_WYgTTo7jA',
          userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID || '2e3iko2tmgo88146l0sqb0nenm',
          loginWith: {
            oauth: {
              domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || 'ap-northeast-1_WYgTTo7jA.auth.ap-northeast-1.amazoncognito.com',
              scopes: ['openid', 'email', 'profile'],
              redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/home'],
              redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/login'],
              responseType: 'token',
            },
          },
        },
      },
    };
    
    console.log('Amplify config:', config); // Debug
    Amplify.configure(config);
    
    // Test that we can import the auth functions
    const { getCurrentUser } = await import('aws-amplify/auth');
    console.log('Auth functions available:', !!getCurrentUser);
    
    console.log('Amplify configured successfully');
    return true;
  } catch (error) {
    console.error('Amplify configuration error:', error);
    throw error;
  }
}