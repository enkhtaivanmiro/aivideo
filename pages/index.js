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

        <main className="home-page-main">
            <h1 className="page-title" style={{textAlign: 'center', marginTop: '50px',paddingBottom: '50px'}}>Video Showcase</h1>
            <VideoGallery videos={sampleVideos} />
        </main>
        </div>
    </div>
  );
}