"use client";

import { useEffect, useState } from "react";
import {auth} from "@/lib/firebase" // Your Firebase client config
import VideoPlayer from "@/components/video-player";

const LessonPage = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideoUrl = async (filepath) => {
    try {
      // Get Firebase ID token of the logged-in user
      const idToken = await auth.currentUser.getIdToken();
      console.log(idToken);

      const response = await fetch("/api/getPresignedUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Include the token in the request
        },
        body: JSON.stringify({ filepath }), // Send the filepath as the payload
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video URL");
      }

      const data = await response.json();
      return data.videoUrl;
    } catch (err) {
      console.error("Error fetching video URL:", err);
      throw err;
    }
  };

  useEffect(() => {
    const filepath = "Course1/lesson3.mp4"; // Replace with your desired video path
    fetchVideoUrl(filepath)
      .then((url) => {
        setVideoUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return(
    <div className="flex space-x-2 items-center justify-center h-screen bg-[#2c3748] p-0 m-0">
      <div className="bg-yellow-500 w-4 h-16 animate-wave"></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.1s' }}></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.2s' }}></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.3s' }}></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.4s' }}></div>
    </div>
    );
}

  if (error) {
    return <div>Error: {error}</div>;
  }

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2, 2.5, 3],
    sources: videoUrl,
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        {loading ? (
          <p>Loading video...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <VideoPlayer options={videoJsOptions} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    backgroundColor: "#f9f9f9",
  },
  videoWrapper: {
    width: "80%",
    maxWidth: "1200px",
    aspectRatio: "16/9",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#000",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default LessonPage;
