"use client";
import React, { useEffect, useState } from 'react';
import VideoPlayer from '/components/video-player.js'; 
import 'video.js/dist/video-js.css';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch('/api/get-presigned-url?filePath=Course1/lesson3.mp4');
        if (!response.ok) throw new Error('Failed to fetch pre-signed URL');
        const data = await response.json();
        setVideoUrl(data.url);
      } catch (error) {
        console.error('Error fetching video URL:', error);
      }
    };

    fetchVideoUrl();
  }, []);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2,2.5,3],
    sources: videoUrl ? [{ src: videoUrl, type: 'video/mp4' }] : [],
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        {videoUrl ? (
          <VideoPlayer options={videoJsOptions} />
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    backgroundColor: '#f9f9f9',
  },
  videoWrapper: {
    width: '80%',
    maxWidth: '1200px',
    aspectRatio: '16/9',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#000',
  },
};

export default App;
