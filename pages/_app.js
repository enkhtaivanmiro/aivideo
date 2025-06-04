import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: '#06090C', color: 'white', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
            <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;