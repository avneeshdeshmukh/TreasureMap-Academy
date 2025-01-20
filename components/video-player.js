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
  
      // Get the container for the player
      const playerContainer = playerRef.current.el();
  
      // Create a custom big play button
      const customBigPlayButton = document.createElement('div');
      customBigPlayButton.className = 'custom-big-play-button';
      customBigPlayButton.innerHTML = `
        <i class="fa-solid fa-circle-play" style="color: #FFD43B; font-size: 60px;"></i>
      `;
  
      // Add click functionality to play the video
      customBigPlayButton.onclick = () => {
        playerRef.current.play();
      };
  
      // Append the custom button to the player container
      playerContainer.appendChild(customBigPlayButton);
  
      // Add event listeners to show/hide the custom button
      playerRef.current.on('play', () => {
        customBigPlayButton.style.display = 'none'; // Hide when playing
      });
  
      playerRef.current.on('pause', () => {
        customBigPlayButton.style.display = 'flex'; // Show when paused
      });
  
      // Ensure button is visible initially
      customBigPlayButton.style.display = 'flex';
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