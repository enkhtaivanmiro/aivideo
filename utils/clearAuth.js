import { Auth } from '../lib/auth';

export const clearAllAuth = async () => {
  try {
    await Auth.signOut();
    
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    }
    
    console.log('All authentication data cleared');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

export const debugAuthState = () => {
  if (typeof window === 'undefined') return;
  console.log('Cookies:', document.cookie);
  console.log('LocalStorage keys:', Object.keys(localStorage));
  console.log('SessionStorage keys:', Object.keys(sessionStorage));
};