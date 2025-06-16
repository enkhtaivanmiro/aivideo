// components/AmplifyProvider.js
'use client';

import { useEffect, useState } from 'react';
import { configureAmplify } from '../lib/amplify';

export default function AmplifyProvider({ children }) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAmplify = async () => {
      try {
        await configureAmplify();
        setIsConfigured(true);
        console.log('AmplifyProvider: Configuration complete');
      } catch (err) {
        console.error('AmplifyProvider: Configuration failed', err);
        setError(err.message);
      }
    };
    initAmplify();
  }, []);

  if (error) {
    return <div>Error initializing authentication: {error}</div>;
  }

  if (!isConfigured) {
    return <div>Loading Amplify configuration...</div>;
  }

  return <>{children}</>;
}