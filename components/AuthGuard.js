// components/AuthGuard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/signup', '/'];
  const protectedRoutes = ['/home', '/upload', '/profile', '/settings', '/admin'];
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('AuthGuard: Checking authentication for:', pathname);
        
        const { getCurrentUser } = await import('aws-amplify/auth');
        
        try {
          const user = await getCurrentUser();
          console.log('AuthGuard: User authenticated:', user.username);
          setIsAuthenticated(true);
          
          if (isPublicRoute && pathname !== '/') {
            console.log('AuthGuard: Redirecting authenticated user to home');
            router.replace('/home');
            return;
          }
        } catch (authError) {
          console.log('AuthGuard: User not authenticated:', authError.message);
          setIsAuthenticated(false);
          
          if (isProtectedRoute) {
            console.log('AuthGuard: Redirecting unauthenticated user to login');
            toast.error('Please log in to access this page');
            router.replace('/login');
            return;
          }
        }
      } catch (error) {
        console.error('AuthGuard: Authentication check failed:', error);
        setIsAuthenticated(false);
        
        if (isProtectedRoute) {
          console.log('AuthGuard: Error occurred, redirecting to login');
          toast.error('Authentication failed. Please log in.');
          router.replace('/login');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      checkAuthentication();
    }
  }, [pathname, router, isPublicRoute, isProtectedRoute, isLoading]);

  if (isLoading || isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: 'white'
      }}>
        Redirecting to login...
      </div>
    );
  }

  if (isPublicRoute && isAuthenticated && pathname !== '/') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: 'white'
      }}>
        Redirecting to home...
      </div>
    );
  }

  return children;
}