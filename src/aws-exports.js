const awsConfig = {
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_26BGFaN5E',
    userPoolWebClientId: '13497e8nuu8vgn0tlloq2n4g9f',
    oauth: {
      domain: 'ap-northeast-126bgfan5e.auth.ap-northeast-1.amazoncognito.com', // <-- here!
      scope: ['email', 'openid', 'phone'],
      redirectSignIn: 'https://d84l1y8p4kdic.cloudfront.net',
      redirectSignOut: 'https://d84l1y8p4kdic.cloudfront.net',
      responseType: 'code',
    },
  },
};

export default awsConfig;
