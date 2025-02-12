'use client'
import VideoPlayer from "@/components/video-player";
import "videojs-markers";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState, useRef, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import MCQModal from "@/components/modals/MCQModal";
import FillInTheBlanksModal from "@/components/modals/FillInTheBlanksModal";
import TrueFalseModal from "@/components/modals/TrueFalseModal";
import SliderQuizModal from "@/components/modals/SliderQuizModal";

export default function VideoQuiz({courseId, videoId}) {
    const firestore = getFirestore();
    const videoRef = doc(firestore, "videos", videoId);

    const [video, setVideo] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [quizMarkers, setQuizMarkers] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(true);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const playerRef = useRef(null);
    const savedTimeRef = useRef(0);

    useEffect(() => {
        const getVideo = async () => {
            try {
                const videoSnap = await getDoc(videoRef);
                const vid = videoSnap.data();
                const quiz = vid.quizzes || [];
                
                if(quiz.length > 0){
                    const markers = Object.keys(quiz).map((key) => ({
                        time: quiz[key].timestamp,
                    }));
                    setQuizzes(quiz);
                    setQuizMarkers(markers);
                }

                setVideo(vid);
            } catch (err) {
                setError(err.message);
            }
        };

        getVideo();
    }, [videoId]);

    useEffect(() => {
        if (!video) return;
        const fetchVideoUrl = async () => {
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch("/api/getPresignedUrl", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ filepath: video.videoURL }),
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
    }, [video]);

    const handleNextQuestion = () => {
        if (!currentQuiz) return;

        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < currentQuiz.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            setIsQuizCompleted(true);
            setCurrentQuiz(null);
            setCurrentQuestionIndex(0);

            // Resume video after completing quiz
            resumeVideo();
        }
    };

    const resumeVideo = () => {
        if (playerRef.current) {
            const resumeTime = savedTimeRef.current + 1;
            playerRef.current.currentTime(resumeTime);

            // Ensure play() is only called after seek completes
            playerRef.current.one("seeked", () => {
                setTimeout(() => {
                    playerRef.current.play().catch((err) => console.error("Error resuming video:", err));
                }, 100);  // Small delay to ensure smooth playback
            });
        }
    };


    const handlePlayerReady = useCallback((player) => {
        playerRef.current = player;

        // Add markers for quiz timestamps
        player.markers({
            markerStyle: {
                width: "7px",
                height: "7px",
                "border-radius": "50%",
                background: "#FACC15",
                position: "absolute",
                bottom: "-2px",
                transform: "translateX(-50%)",
            },
            markers: quizMarkers || [],
        });

        const handleTimeUpdate = () => {
            const currentTime = player.currentTime();

            quizMarkers.forEach(marker => {
                if (
                    Math.abs(currentTime - marker.time) < 0.2   // Prevent repeat triggering
                ) {
                    player.pause();
                    savedTimeRef.current = marker.time;

                    const questions = quizzes[marker.time]?.questions;
                    if (questions) {
                        setCurrentQuiz(questions);
                        setIsQuizCompleted(false);  // Set first question

                        if (document.fullscreenElement || document.webkitFullscreenElement) {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen(); // For Safari
                            }
                        }
                    }
                }
            });
        };

        player.on("timeupdate", handleTimeUpdate);

        return () => {
            player.off("timeupdate", handleTimeUpdate);
        };
    }, [quizMarkers, quizzes]);


    const currentQuestion = currentQuiz ? currentQuiz[currentQuestionIndex] : null;

    return (
        <>
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

            {currentQuestion && currentQuestion.type === "mcq" && (
                <MCQModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} />
            )}

            {currentQuestion && currentQuestion.type === "fillBlanks" && (
                <FillInTheBlanksModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} />
            )}

            {currentQuestion && currentQuestion.type === "trueFalse" && (
                <TrueFalseModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} />
            )}

            {currentQuestion && currentQuestion.type === "slider" && (
                <SliderQuizModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} />
            )}
        </>
    );
}
