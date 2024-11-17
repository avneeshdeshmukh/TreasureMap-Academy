"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [currentQuizMarks, setCurrentQuizMarks] = useState(0);
  const [shownQuizzes, setShownQuizzes] = useState([]);
  const [quizStatus, setQuizStatus] = useState({});

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const videoUrl = "/trailvideos/dsa.mp4";

  const quizzes = [
    {
      timestamp: 30,
      questions: [
        {
          question: "What type of clip did you just see?",
          options: ["A landscape view", "A countdown timer", "A nature scene", "An animation"],
          correctAnswer: 0,
        },
        {
          question: "What was the predominant color in the previous scene?",
          options: ["Blue", "Green", "Red", "Yellow"],
          correctAnswer: 1,
        },
      ],
    },
    {
      timestamp: 50,
      questions: [
        {
          question: "What is the main focus of the current clip?",
          options: [
            "Action-packed sequence",
            "A calm and serene landscape",
            "An informational diagram",
            "A bustling cityscape",
          ],
          correctAnswer: 3,
        },
        {
          question: "How many characters were in the last scene?",
          options: ["0", "1", "2", "3"],
          correctAnswer: 2,
        },
      ],
    },
  ];

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);

      const currentTimestamp = Math.floor(video.currentTime);
      const quizToShow = quizzes.find(
        (quiz) => currentTimestamp === quiz.timestamp && !shownQuizzes.includes(quiz.timestamp)
      );

      if (quizToShow) {
        video.pause();
        setIsPlaying(false);
        setShowQuiz(true);
        setCurrentQuestionIndex(0);
        setCurrentQuizMarks(0);
        setShownQuizzes((prev) => [...prev, quizToShow.timestamp]);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleAnswerSubmit = (answerIndex) => {
    const currentQuiz = quizzes.find(
      (quiz) => Math.floor(currentTime) === quiz.timestamp
    );
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    if (answerIndex === currentQuestion.correctAnswer) {
      setTotalMarks((prev) => prev + 5);
      setCurrentQuizMarks((prev) => prev + 5);
    }

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowQuiz(false);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto relative">
        {/* Total Marks Display */}
        <div className="fixed top-6 left-6 bg-blue-600 text-white p-3 mr-64 rounded-lg z-50">
          Total Marks: {totalMarks}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            src={videoUrl}
            controls={false}
          >
            Your browser does not support the video tag.
          </video>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <div
              ref={progressRef}
              className="relative w-full h-2 bg-gray-300 mb-4 cursor-pointer rounded-full"
            >
              <div
                className="absolute h-full bg-blue-500"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              {quizzes.map((quiz, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full"
                  style={{
                    left: `${(quiz.timestamp / duration) * 100}%`,
                    width: "4px",
                    backgroundColor: quizStatus[quiz.timestamp] === undefined
                      ? "yellow"
                      : "green",
                  }}
                />
              ))}
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="text-white ml-auto">
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Quiz Overlay */}
          {showQuiz && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <div className="mb-4 text-lg font-bold text-blue-500">
                  Current Quiz Marks: {currentQuizMarks} | Total Marks: {totalMarks}
                </div>

                <h3 className="text-xl font-bold mb-4">
                  {
                    quizzes
                      .find((quiz) => Math.floor(currentTime) === quiz.timestamp)
                      ?.questions[currentQuestionIndex]?.question
                  }
                </h3>
                <div className="space-y-2">
                  {quizzes
                    .find((quiz) => Math.floor(currentTime) === quiz.timestamp)
                    ?.questions[currentQuestionIndex]?.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSubmit(index)}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        {option}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VideoPlayer;
