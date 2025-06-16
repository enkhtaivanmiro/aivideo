// app/layout.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import AmplifyProvider from '../components/AmplifyProvider';
import AuthGuard from '../components/AuthGuard';

export const metadata = {
  title: 'Home',
  description: 'User dashboard page',
};

function ClientRoot({ children }) {
  return (
    <AmplifyProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </AmplifyProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: '#06090C',
          color: 'white',
          minHeight: '100vh',
          width: '100vw',
          overflowX: 'hidden',
        }}
      >
        <Toaster position="bottom-center" />
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}