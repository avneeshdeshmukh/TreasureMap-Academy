import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Default Video.js styles
// import './material-skin.css'; // Your Material Design-inspired skin
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome styles

const VideoPlayer = ({ options }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, options, function () {
        console.log('Player is ready!');
      });

      
      const bigPlayButton = playerRef.current.bigPlayButton.el();
      bigPlayButton.innerHTML = `
        <i class="fa-solid fa-circle-play fa-beat-fade" style="color: #FFD43B; font-size: 60px;"></i>
      `;

      // Add event listener for 'pause' to show the big play button
      playerRef.current.on('pause', () => {
        bigPlayButton.style.display = 'flex'; // Show big play button
      });

      // Add event listener for 'play' to hide the big play button
      playerRef.current.on('play', () => {
        bigPlayButton.style.display = 'none'; // Hide big play button
      });
    }

    return () => {
      // Cleanup player on unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-skin-material" />
      </div>
    </div>
  );
};

export default VideoPlayer;
