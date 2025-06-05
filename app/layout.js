// app/layout.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        backgroundColor: '#06090C',
        color: 'white',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden'
      }}>
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}
