"use client";
import React from 'react';
import VideoPlayer from '/components/video-player.js';
import 'video.js/dist/video-js.css'; 
// import'./globals.css';

const App = () => {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2,2.5,3], 
    sources: [
      {
        src: '/videos/lesson3.mp4', 
        type: 'video/mp4',
      },
    ],
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        <VideoPlayer options={videoJsOptions} />
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
    backgroundColor: '#f9f9f9', // Light background for contrast
  },
  videoWrapper: {
    width: '80%', // Larger video width
    maxWidth: '1200px', // Max width for larger screens
    aspectRatio: '16/9', // Maintain 16:9 aspect ratio
    borderRadius: '20px', 
    overflow: 'hidden', // Ensure content fits inside rounded corners
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)', // Soft shadow
    backgroundColor: '#000', // Black background inside the player wrapper
  },
};

export default App;
