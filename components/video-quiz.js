'use client'
import VideoPlayer from "@/components/video-player";
import "videojs-markers";
import { doc, getDoc, getFirestore, increment, updateDoc } from "firebase/firestore";
import { useState, useRef, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import MCQModal from "@/components/modals/MCQModal";
import FillInTheBlanksModal from "@/components/modals/FillInTheBlanksModal";
import TrueFalseModal from "@/components/modals/TrueFalseModal";
import SliderQuizModal from "@/components/modals/SliderQuizModal";
import { getQPS, getQuizMetrics, getDS, getES, getRPS } from "@/lib/pluh-calculations";
import { useCoins } from "@/app/context/CoinsContext";
import { useStreak } from "@/app/context/StreakContext";

export default function VideoQuiz({ courseId, videoId, preview, startTime, allowedTs }) {
    const { setCoins } = useCoins();
    const { setStreak } = useStreak();
    const firestore = getFirestore();
    const videoRef = doc(firestore, "videos", videoId);

    const [video, setVideo] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [quizMarkers, setQuizMarkers] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuizTimestamp, setCurrentQuizTimestamp] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(true);
    const [currentQuizPoints, setCurrentQuizPoints] = useState(0);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [factors, setFactors] = useState(null);
    const [isIncremented, setIsIncremented] = useState(false);

    const playerRef = useRef(null);
    const savedTimeRef = useRef(0);
    const lastAllowedTimeRef = useRef(0);
    const recentlyCompletedMarkers = useRef(new Set());

    useEffect(() => {
        if (allowedTs) {
            lastAllowedTimeRef.current = allowedTs;  // Allow seeking to startTime
        }
    }, [allowedTs]);

    function isYesterday(date) {
        const givenDate = new Date(date);
        const now = new Date();

        // Convert both dates to the user's local timezone by resetting time to midnight
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        givenDate.setHours(0, 0, 0, 0);

        return givenDate.getTime() === yesterday.getTime();
    }

    const fetchAttempts = async () => {
        if (preview) return;

        const videoNotesRef = doc(firestore, "videoNotes", `${videoId}_${auth.currentUser.uid}`);

        const vnSnap = await getDoc(videoNotesRef);

        // Extract current quizzes map or initialize an empty object
        const quiz = vnSnap.exists() ? vnSnap.data().quizzes || {} : null;
        const quizTimes = quizMarkers.map(marker => marker.time);

        console.log(quiz);
        console.log(quizTimes);
        let factor = {}; // Initialize an empty object

        if (quiz) {
            quizTimes.forEach(timestamp => {
                if (quiz[timestamp]) {
                    let attempt = quiz[timestamp].attempt;

                    // Replace attempt values based on the given mapping
                    if (attempt === 0) {
                        factor[timestamp] = 10;
                    } else if (attempt === 1) {
                        factor[timestamp] = 5;
                    } else if (attempt === 2) {
                        factor[timestamp] = 2;
                    } else if (attempt > 2) {
                        factor[timestamp] = 1;
                    }
                } else {
                    factor[timestamp] = 10;
                }
            });
        }
        console.log(factor);
        setFactors(factor);
    }

    useEffect(() => {
        const getVideo = async () => {
            try {
                const videoSnap = await getDoc(videoRef);
                const vid = videoSnap.data();
                const quiz = vid.quizzes;

                if (quiz) {
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
        if (quizzes && quizMarkers.length > 0) {
            fetchAttempts(); // Call only after quizzes and markers are set
        }
    }, [quizzes, quizMarkers]);

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

    const handleNextQuestion = async () => {
        if (!currentQuiz) return;

        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < currentQuiz.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            setIsQuizCompleted(true);
            setCurrentQuiz(null);
            setCurrentQuestionIndex(0);
            recentlyCompletedMarkers.current.add(currentQuizTimestamp);
            if (!preview) {
                const videoNotesRef = doc(firestore, "videoNotes", `${videoId}_${auth.currentUser.uid}`);
                const userProgressRef = doc(firestore, "userProgress", auth.currentUser.uid);
                let att = 1;

                try {
                    const vnSnap = await getDoc(videoNotesRef);

                    // Extract current quizzes map or initialize an empty object
                    let quizzes = vnSnap.exists() ? vnSnap.data().quizzes || {} : {};
                    console.log(quizzes);

                    // Check if the current quiz timestamp exists, otherwise initialize it
                    if (!quizzes[currentQuizTimestamp]) {
                        quizzes[currentQuizTimestamp] = {
                            attempt: 0, // Default attempt count
                            timestamp: currentQuizTimestamp,
                        };
                    }

                    // Increment attempt count
                    quizzes[currentQuizTimestamp].attempt += 1;
                    att = quizzes[currentQuizTimestamp].attempt;

                    // Perform the update
                    await updateDoc(videoNotesRef, {
                        [`quizzes.${currentQuizTimestamp}`]: quizzes[currentQuizTimestamp],
                    });

                    console.log("Attempt updated successfully!");
                } catch (error) {
                    console.error("Error updating attempt:", error);
                }

                try {
                    const { difficulty, ratio } = getQuizMetrics(currentQuiz, currentQuizPoints, factors[currentQuizTimestamp]);
                    console.log(difficulty)
                    console.log(ratio)

                    const userProgSnap = await getDoc(userProgressRef);
                    const QPS = getQPS(userProgSnap.data(), ratio, att);
                    const DS = getDS(userProgSnap.data(), difficulty, att);

                    let updateData = {
                        coins: increment(currentQuizPoints),
                        [`courseProgress.${courseId}.courseCoins`]: increment(currentQuizPoints),
                        "PLUH.QPS": QPS,
                        "PLUH.DS": DS,
                        "PLUH.RPS" : getRPS(userProgSnap.data(), currentQuizPoints),
                        leaderboardCoins : increment(currentQuizPoints),
                    };

                    // Add additional properties if `att - 1 === 0`
                    if (att - 1 === 0) {
                        updateData[`courseProgress.${courseId}.quizzesCompleted`] = increment(1);
                        if (userProgSnap.data().lastLesson && isYesterday(userProgSnap.data().lastLesson.toDate())) {
                            updateData["lastLesson"] = new Date();
                            updateData["streak"] = increment(1);
                            updateData["PLUH.ES"] = getES(userProgSnap.data());
                            console.log(getES(userProgSnap.data()));
                            setStreak(userProgSnap.data().streak + 1);
                        } else if(!userProgSnap.data().lastLesson){
                            updateData["lastLesson"] = new Date();
                            updateData["streak"] = increment(1);
                            updateData["PLUH.ES"] = getES(userProgSnap.data());
                            console.log(getES(userProgSnap.data()));
                            setStreak(userProgSnap.data().streak + 1);
                        }
                    }

                    // Update Firestore document with optimized object
                    await updateDoc(userProgressRef, updateData);
                    setCoins(userProgSnap.data().coins + currentQuizPoints);

                } catch (error) {
                    console.log(error);
                }
            }

            setCurrentQuizPoints(0);
            if (!preview) alert(`Your coins : ${currentQuizPoints}`);
            resumeVideo();
        }
    };

    const resumeVideo = () => {
        if (playerRef.current) {
            const resumeTime = savedTimeRef.current + 0.5;
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

        if (startTime) {
            lastAllowedTimeRef.current = allowedTs; // Set initial allowed time
            player.currentTime(startTime); // Seek to startTime
        }

        const quizTimes = quizMarkers.map(marker => marker.time);

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
            markers: quizMarkers,
        });

        const handleTimeUpdate = async () => {
            const currentTime = player.currentTime();

            if (currentTime > lastAllowedTimeRef.current) {
                lastAllowedTimeRef.current = currentTime;
            }

            recentlyCompletedMarkers.current.forEach((markerTime) => {
                if (currentTime > markerTime + 0.5) { // Adjust this threshold as needed
                    recentlyCompletedMarkers.current.delete(markerTime);
                }
            });

            // Check if video is completed
            console.log(player.duration());
            if (currentTime >= player.duration() - 0.5) {  // Allow small margin for precision
                if (!preview) {
                    const videoNotesRef = doc(firestore, "videoNotes", `${videoId}_${auth.currentUser.uid}`);
                    const userProgressRef = doc(firestore, "userProgress", auth.currentUser.uid);

                    try {
                        const vnSnap = await getDoc(videoNotesRef);
                        if (vnSnap.exists() && vnSnap.data().isCompleted) {
                            return; // Don't update if already true
                        }
                        if(!isIncremented){
                            await updateDoc(videoNotesRef, { isCompleted: true }, { merge: true });
                            await updateDoc(userProgressRef, {
                                [`courseProgress.${courseId}.currentVideo`]: increment(1)
                            }, { merge: true })
                            setIsIncremented(true);
                            console.log("Video marked as completed");
                        }
                    } catch (error) {
                        console.error("Error updating completion status:", error);
                    }
                }
            }

            quizMarkers.forEach(marker => {
                const timeDifference = Math.abs(currentTime - marker.time);
                if (
                    recentlyCompletedMarkers.current.has(marker.time) ||
                    timeDifference >= 0.17
                ) {
                    return;
                }
                
                if (timeDifference < 0.17){
                    player.pause();
                    savedTimeRef.current = Math.round(currentTime);

                    const questions = quizzes[marker.time]?.questions;
                    const timestamp = quizzes[marker.time]?.timestamp;
                    if (questions) {
                        setCurrentQuiz(questions);
                        console.log(JSON.stringify(questions));
                        setCurrentQuizTimestamp(timestamp);
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

            if (!preview) {
                let progressTime = parseInt(currentTime);

                const progressItem = {
                    videoId,
                    courseId,
                    userId: auth.currentUser.uid,
                    timestamp: progressTime,
                }

                localStorage.setItem("progress", JSON.stringify(progressItem));
            }
        };

        const handleSeeking = () => {
            const player = playerRef.current;
            if (!player) return;

            const seekTime = player.currentTime();
            const nextQuizTime = quizMarkers.map(m => m.time).find(time => time > lastAllowedTimeRef.current);

            if (nextQuizTime !== undefined && seekTime > nextQuizTime) {
                player.currentTime(lastAllowedTimeRef.current);  // Restrict seeking past quizzes
            }
        };


        player.on("timeupdate", handleTimeUpdate);
        player.on('ended', function () {
            const progressItem = {
                videoId,
                courseId,
                userId: auth.currentUser.uid,
                timestamp: 0,
            }
            localStorage.setItem("progress", JSON.stringify(progressItem));
        });
        if (!preview) player.on("seeking", handleSeeking);

        return () => {
            player.off("timeupdate", handleTimeUpdate);
            if (!preview) player.off("seeking", handleSeeking);
        };
    }, [quizMarkers, quizzes, startTime]);


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
                <MCQModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} preview={preview} currentPoints={currentQuizPoints} setCoins={setCurrentQuizPoints} factor={factors} time={currentQuizTimestamp} />
            )}

            {currentQuestion && currentQuestion.type === "fillBlanks" && (
                <FillInTheBlanksModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} preview={preview} currentPoints={currentQuizPoints} setCoins={setCurrentQuizPoints} factor={factors} time={currentQuizTimestamp} />
            )}

            {currentQuestion && currentQuestion.type === "trueFalse" && (
                <TrueFalseModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} preview={preview} currentPoints={currentQuizPoints} setCoins={setCurrentQuizPoints} factor={factors} time={currentQuizTimestamp} />
            )}

            {currentQuestion && currentQuestion.type === "slider" && (
                <SliderQuizModal questionData={currentQuestion} onSubmit={handleNextQuestion} onClose={handleNextQuestion} preview={preview} currentPoints={currentQuizPoints} setCoins={setCurrentQuizPoints} factor={factors} time={currentQuizTimestamp} />
            )}
        </>
    );
}
