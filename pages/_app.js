import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;