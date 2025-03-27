import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const VideoPlayer = ({ options, onPlayerReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const player = videojs(videoRef.current, options, () => {
        console.log("Player is ready!");
        if (onPlayerReady) onPlayerReady(player);
      });

      playerRef.current = player;
      const playerContainer = player.el();

      /*** Custom Big Play Button ***/
      const customPlayButton = document.createElement("div");
      customPlayButton.className = "custom-big-play-button";
      customPlayButton.innerHTML = `
        <i class="fa-solid fa-circle-play" style="color: #FFD43B; font-size: 60px;"></i>
      `;

      customPlayButton.onclick = () => player.play();
      playerContainer.appendChild(customPlayButton);

      player.on("play", () => (customPlayButton.style.display = "none"));
      player.on("pause", () => (customPlayButton.style.display = "flex"));
      customPlayButton.style.display = "flex";

      /*** Custom Current Time Display ***/
      const controlBar = player.getChild("controlBar");
      const volumePanel = controlBar.getChild("volumePanel");

      const timeDisplay = document.createElement("div");
      timeDisplay.className = "vjs-current-time-display vjs-time-control";
      timeDisplay.style.marginLeft = "8px";
      timeDisplay.innerHTML = "0:00";

      if (volumePanel) {
        controlBar.el().insertBefore(timeDisplay, volumePanel.el().nextSibling);
      }

      player.on("timeupdate", () => {
        timeDisplay.innerHTML = videojs.time.formatTime(player.currentTime());
      });
    }

    return () => {
      if (playerRef.current) {
        console.log("Stopping player instead of disposing to prevent black screen.");
        playerRef.current.pause(); // Pause instead of dispose
      }
    };
  }, [options, onPlayerReady]);


  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-skin-material" />
      </div>
    </div>
  );
};

export default VideoPlayer;