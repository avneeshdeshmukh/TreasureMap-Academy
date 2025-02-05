"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import videojs from "video.js";
import "videojs-markers"; 
import { auth } from "@/lib/firebase";
import VideoPlayer from "@/components/video-player";
import MCQModal from "@/components/modals/MCQModal";
import TrueFalseModal from "@/components/modals/TrueFalseModal";
import FillInTheBlanksModal from "@/components/modals/FillInTheBlanksModal";

const LessonPage = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMCQ, setShowMCQ] = useState(false);
  const [showTF, setShowTF] = useState(false);
  const [showFIB, setShowFIB] = useState(false);

  const [mcqCompleted, setMCQCompleted] = useState(false);
  const [tfCompleted, setTFCompleted] = useState(false);
  const [fibCompleted, setFIBCompleted] = useState(false);

  const playerRef = useRef(null);
  const savedMCQTimeRef = useRef(0);
  const savedTFTimeRef = useRef(0);
  const savedFIBTimeRef = useRef(0);

  const mcqQuizData = {
    timestamp: 3,
    type: "mcq",
    question: "What is the capital of France?",
    options: ["Berlin", "Paris", "Madrid", "Rome"],
    correctAnswer: "Paris",
  };

  const tfQuizData = {
    timestamp: 10,
    type: "truefalse",
    question: "The Earth is flat.",
    correctAnswer: "False",
  };

  const [fibQuizData, setFibQuizData] = useState({
    timestamp: 20,
    type: "fillInTheBlanks",
    question: "The national animal of India is ____.\n",
    correctAnswer: "Tiger",
  });

  const generateAsterisks = (correctAnswer) => "*".repeat(correctAnswer.length);

  useEffect(() => {
    setFibQuizData((prev) => ({
      ...prev,
      question: `The national animal of India is ____.\n ${generateAsterisks(prev.correctAnswer)}`,
    }));
  }, []);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch("/api/getPresignedUrl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ filepath: "Course1/lesson3.mp4" }),
        });

        if (!response.ok) throw new Error("Failed to fetch video URL");

        const data = await response.json();
        setVideoUrl(data.videoUrl);
      } catch (err) {
        console.error("Error fetching video URL:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, []);

  const handlePlayerReady = useCallback(
    (player) => {
      playerRef.current = player;

      player.markers({
        markerStyle: {
          width: "7px",
          height: "7px",
          "border-radius": "50%",
          background: "#FACC15",
          position: "absolute",
          bottom: "-2px", // Moves the dot down closer to the progress bar
          transform: "translateX(-50%)", // Centers the dot exactly at the timestamp
        },
        markers: [
          { time: mcqQuizData.timestamp },
          { time: tfQuizData.timestamp },
          { time: fibQuizData.timestamp },
        ],
      });
      

      const handleTimeUpdate = () => {
        const currentTime = player.currentTime();

        if (!mcqCompleted && Math.floor(currentTime) === mcqQuizData.timestamp) {
          savedMCQTimeRef.current = currentTime;
          player.pause();
          setShowMCQ(true);
        }

        if (!tfCompleted && Math.floor(currentTime) === tfQuizData.timestamp) {
          savedTFTimeRef.current = currentTime;
          player.pause();
          setShowTF(true);
        }

        if (!fibCompleted && Math.floor(currentTime) === fibQuizData.timestamp) {
          savedFIBTimeRef.current = currentTime;
          player.pause();
          setShowFIB(true);
        }
      };

      player.on("timeupdate", handleTimeUpdate);

      return () => {
        player.off("timeupdate", handleTimeUpdate);
      };
    },
    [mcqCompleted, tfCompleted, fibCompleted]
  );

  const resumeVideo = (savedTimeRef) => {
    if (playerRef.current) {
      const resumeTime = savedTimeRef.current + 1;
      playerRef.current.currentTime(resumeTime);
      playerRef.current.one("seeked", () => {
        playerRef.current.play().catch((err) => console.error("Error resuming video:", err));
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-4/5 max-w-4xl aspect-video bg-black rounded-lg shadow-lg overflow-hidden">
        {videoUrl ? (
          <VideoPlayer
            options={{
              autoplay: false,
              controls: true,
              responsive: true,
              fluid: true,
              playbackRates: [0.5, 1, 1.5, 2, 2.5, 3],
              sources: [{ src: videoUrl, type: "video/mp4" }],
            }}
            onPlayerReady={handlePlayerReady}
          />
        ) : (
          <p className="text-white text-center p-4">Loading video...</p>
        )}
      </div>

      {showMCQ && (
        <MCQModal
          questionData={mcqQuizData}
          onSubmit={() => {
            setMCQCompleted(true);
            setShowMCQ(false);
            resumeVideo(savedMCQTimeRef);
          }}
          onClose={() => {
            setShowMCQ(false);
            resumeVideo(savedMCQTimeRef);
          }}
        />
      )}

      {showTF && (
        <TrueFalseModal
          questionData={tfQuizData}
          onSubmit={() => {
            setTFCompleted(true);
            setShowTF(false);
            resumeVideo(savedTFTimeRef);
          }}
          onClose={() => {
            setShowTF(false);
            resumeVideo(savedTFTimeRef);
          }}
        />
      )}

      {showFIB && (
        <FillInTheBlanksModal
          questionData={fibQuizData}
          onSubmit={() => {
            setFIBCompleted(true);
            setShowFIB(false);
            resumeVideo(savedFIBTimeRef);
          }}
          onClose={() => {
            setShowFIB(false);
            resumeVideo(savedFIBTimeRef);
          }}
        />
      )}
    </div>
  );
};

export default LessonPage;
