'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../lib/auth'; 

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/', '/login', '/signup', '/auth'];
  const protectedRoutes = ['/home', '/upload', '/profile', '/settings', '/admin'];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        console.log('AuthGuard: Authenticated as', user.username);
        setIsAuthenticated(true);

        if ((pathname === '/login' || pathname === '/signup') && isAuthenticated) {
          router.replace('/home');
          toast.success('Already logged in, redirecting to home');
        }
      } catch (err) {
        console.log('AuthGuard: Not authenticated:', err.message);
        setIsAuthenticated(false);

        if (isProtectedRoute) {
          router.replace('/login');
          toast.error('Please log in to access this page');
        }
      }
    };

    checkAuth();
  }, [pathname, isAuthenticated, isProtectedRoute, router]);

  if (isAuthenticated === null) {
    return (
      <div style={centerStyle}>
        <div>Loading...</div>
      </div>
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div style={centerStyle}>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  if ((pathname === '/login' || pathname === '/signup') && isAuthenticated) {
    return (
      <div style={centerStyle}>
        <div>Redirecting to home...</div>
      </div>
    );
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