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

  // Define route categories
  const publicRoutes = ['/login', '/signup', '/'];
  const protectedRoutes = ['/home', '/upload', '/profile', '/settings'];
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('AuthGuard: Checking authentication for:', pathname);
        
        // Import auth functions dynamically
        const { getCurrentUser } = await import('aws-amplify/auth');
        
        try {
          const user = await getCurrentUser();
          console.log('AuthGuard: User authenticated:', user.username);
          setIsAuthenticated(true);
          
          // If user is authenticated and trying to access login/signup, redirect to home
          if (isPublicRoute && pathname !== '/') {
            console.log('AuthGuard: Redirecting authenticated user to home');
            router.replace('/home');
            return;
          }
        } catch (authError) {
          console.log('AuthGuard: User not authenticated:', authError.message);
          setIsAuthenticated(false);
          
          // If user is not authenticated and trying to access protected route, redirect to login
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
        
        // If there's an error and user is trying to access protected route, redirect to login
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

    // Only check authentication if we're not already loading
    if (isLoading) {
      checkAuthentication();
    }
  }, [pathname, router, isPublicRoute, isProtectedRoute, isLoading]);

  // Show loading while checking authentication
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

  // For protected routes, only render if authenticated
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

  // For public routes accessed by authenticated users, show loading while redirecting
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