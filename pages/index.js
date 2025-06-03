import Head from 'next/head';
import VideoGallery from '../components/VideoGallery';
import { videos as sampleVideos } from '../lib/videoData';

export default function HomePage() {
  return (
    <div>
        <div>
        <Head>
            <title>My Video Gallery</title>
            <meta name="description" content="A gallery of cool videos" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="home-page-main" style={{textAlign: 'center', backgroundImage: 'url(/Hero-grad.png)'}}>
            <header style={{display: 'flex', justifyContent: 'space-between', padding: '40px'}}>
                <h1>Logo</h1>
                <button style={{padding: '12px 20px', borderRadius: '18px', border: '0', backgroundColor: 'white', fontSize: '13px', color: '#06090C'}}>Холбогдох</button>
            </header>
            <h1 className="page-title" style={{paddingTop: '6rem', fontSize: '64px'}}>Хиймэл оюун ухаан <br></br><span style={{color: '#DF3C5F'}}>урласан контент</span></h1>
            <p style={{paddingBottom: '6rem', paddingTop: '10px', color: '#8C8D8F'}}>Контентыг хурдан хугацаанд зардал багатайгаар</p>
            <div style={{ animation: 'bounceDown 2s infinite', paddingBottom: '6rem' }}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="#DF3C5F"
                viewBox="0 0 24 24"
                >
                <path d="M12 16.5l6-6h-4V3h-4v7.5H6l6 6z" />
                </svg>
            </div>
            <VideoGallery videos={sampleVideos} />
        </main>
        <footer>
            <p style={{textAlign: 'center', fontWeight: 'bold', paddingTop: '40px'}}>Powered by:</p>
            <div
                style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                marginBottom: '40px',
                marginTop: '20px'
                }}
            >
                <img src="/logos/gemini.png" alt="Logo 1" style={{ height: '70px' }} />
                <img src="/logos/chatgpt.png" alt="Logo 2" style={{ height: '70px' }} />
                <img src="/logos/midjourney.png" alt="Logo 3" style={{ height: '70px' }} />
                {/* Add more logos as needed */}
            </div>
            <p style={{ padding: '1rem', textAlign: 'center', color: '#8C8D8F', fontWeight: 'bold', marginBottom: '40px'}}>© 2025 Multimedia Enterprise LLC. All rights reserved.</p>
        </footer>
        </div>
    </div>
  );
}