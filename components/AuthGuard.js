'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Auth } from '../lib/auth';

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const publicPages = ['/login', '/signup', '/forgot-password', '/', '/verification'];;
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const checkAuthStatus = async () => {
    try {
      const hasToken = Auth.isAuthenticated();
      
      if (hasToken) {
        try {
          await Auth.currentAuthenticatedUser();
          setIsAuthenticated(true);
          
          if (pathname === '/login') {
            router.push('/home');
            return;
          }
        } catch (error) {
          console.log('Token validation failed:', error);
          await Auth.signOut();
          setIsAuthenticated(false);
          
          if (!isPublicPage) {
            router.push('/login');
          }
        }
      } else {
        setIsAuthenticated(false);
        
        if (!isPublicPage) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(false);
      
      if (!isPublicPage) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={centerStyle}>Loading...</div>;
  }

  if (isAuthenticated && pathname === '/login') {
    return <div style={centerStyle}>Redirecting...</div>;
  }

  return children;
}

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '16px',
  color: 'white',
};