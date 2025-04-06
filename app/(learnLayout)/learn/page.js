"use client"
import { FeedWrapper } from "@/components/feed-wrapper";
import { Stats } from "./stats";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { StreakIcons } from "@/components/streak-icons";
import { Header } from "./header";
import { LessonButton } from "./lesson-button";
import LeaderboardPos from "./leaderboard-position";
import { doc, getFirestore, collection, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { setLatestCourse } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import StreakGoalModal from "./streak-modal";
import { IoClose } from 'react-icons/io5'; // Import the close icon
import Certificate from "@/components/certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LearnPage = () => {
    const firestore = getFirestore();
    const { user } = useAuth();
    const router = useRouter();
    const [isCertOpen, setIsCertOpen] = useState(false);
    const certificateRef = useRef(null);


    const userRef = doc(firestore, "users", user.uid);
    const userProgRef = doc(firestore, "userProgress", user.uid);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChestOpened, setIsChestOpened] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [courseId, setCourseId] = useState(null);
    const [topCourses, setTopCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [lastVideo, setLastVideo] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [position, setPosition] = useState(null);
    const [level, setLevel] = useState(null);

    const fetchUserDetails = async () => {
        const usr = await getDoc(userRef);
        if (!usr.exists()) {
            console.log("User not found");
            return;
        }

        const usrData = usr.data();
        setUserData(usrData);

        setCourseId(usrData.enrolledCourses?.[0] || null);
        if (usrData.enrolledCourses?.length <= 3)
            setTopCourses(usrData.enrolledCourses)
        else if (usrData.enrolledCourses?.length > 3)
            setTopCourses(usrData.enrolledCourses.slice(0, 3))
    };

    const downloadPDF = () => {
        if (!certificateRef.current) return;

        html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape");
            pdf.addImage(imgData, "PNG", 10, 10, 280, 200);
            pdf.save("certificate.pdf");
        });

        setModalOpen(true);
        setIsCertOpen(false);
    };

    const handleSaveGoal = async (goal) => {
        try {
            console.log("Streak goal set to:", goal);
            await updateDoc(userProgRef, { streakGoal: goal });
            console.log("Streak goal updated successfully in Firestore");
        } catch (error) {
            console.error("Error updating streak goal:", error);
        }
    };

    const fetchVideos = async () => {
        if (!courseId) return;

        const videosRef = collection(firestore, "videos");
        const q = query(videosRef, where("course", "==", courseId));

        try {
            const querySnapshot = await getDocs(q);
            const videosList = querySnapshot.docs.map(doc => ({
                videoId: doc.data().videoId,
                ...doc.data(),
            }));
            videosList.sort((a, b) => a.sequence - b.sequence);
            setVideos(videosList);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    const fetchUserProgress = async () => {
        if (!courseId || !videos.length) return;

        try {
            const prog = await getDoc(userProgRef);
            const progData = prog.data();
            setUserProgress(progData);
            const last = progData?.courseProgress?.[courseId]?.currentVideo || 1;
            setLastVideo(last);
            const videoNotesRef = doc(firestore, "videoNotes", `${videos[last - 1].videoId}_${user.uid}`);
            const vnSnap = await getDoc(videoNotesRef);
            console.log(vnSnap.data());
            if (vnSnap.exists()) {
                const vnData = vnSnap.data();
                const percent = (vnData.lastProgressTime / vnData.duration) * 100;
                setPercentage(percent);
            } else {
                setPercentage(0);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, [user])

    useEffect(() => {
        fetchVideos();
    }, [courseId])

    useEffect(() => {
        fetchUserProgress();
    }, [user, courseId, videos])

    useEffect(() => {
        const setLeaderboardPosition = async () => {
            const userSnap = await getDoc(userProgRef);
            const userData = userSnap.data();

            if (!Object.keys(userData).includes("currentLeaderboard")) {
                userData.currentLeaderboard = null;
                setPosition(0);
                setLeadType(null);
                return;
            }

            const leaderboardRef = doc(firestore, "leaderboard", userData.currentLeaderboard);
            const leaderboardSnap = await getDoc(leaderboardRef);
            const allUsers = leaderboardSnap.data().users;

            const position = allUsers.indexOf(userData.username) + 1;

            setPosition(position);
            setLevel(leaderboardSnap.data().level)
        }

        setLeaderboardPosition();
    }, [user])

    const handleCourseSelect = async (selectedCourse) => {
        const updatedCourses = setLatestCourse(userData.enrolledCourses, selectedCourse);
        setCourseId(updatedCourses[0]);
        if (userData.enrolledCourses?.length <= 3)
            setTopCourses(updatedCourses)
        else if (userData.enrolledCourses?.length > 3)
            setTopCourses(updatedCourses.slice(0, 3))

        await updateDoc(userRef, {
            enrolledCourses: updatedCourses
        })
    };

    const handleAfterSelect = async () => {
        fetchUserDetails();
        fetchVideos();
    }

    if (topCourses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 sm:p-8 md:p-12 lg:p-20 xl:p-40 text-center">
                <div className="bg-[#f8e8c8] border border-yellow-700 shadow-lg rounded-xl w-full max-w-md p-4 sm:p-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-yellow-900">
                        No Courses Yet!
                    </h1>
                    <p className="text-gray-800 mt-2 text-xs sm:text-sm md:text-base">
                        Your course library is empty. Discover courses that match your
                        interests.
                    </p>
                    <button
                        className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base"
                        onClick={() => { router.push('/shop') }}
                    >
                        Go To Shop
                    </button>
                </div>
            </div>
        );
    }

    if (userProgress && topCourses.length !== 0) {
        return (
            <div className="flex flex-row-reverse gap-[48px] px-6">
                <StickyWrapper>
                    <StreakIcons streak={39} />
                    <Stats userProgress={userProgress} courseId={topCourses[0]} setIsModalOpen={setIsModalOpen} />
                    <LeaderboardPos position={position} level={level} />
                </StickyWrapper>
                <StreakGoalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveGoal}
                />
                <FeedWrapper>
                    <Header topCourses={topCourses} onCourseSelect={handleCourseSelect} afterSelect={handleAfterSelect} />
                    <div className="relative flex flex-col items-center">
                        {videos.length > 0 && lastVideo !== null && videos.map((lesson, idx) => {
                            const isLocked = lesson.sequence > lastVideo;
                            console.log(`Lesson ${lesson.videoId} - Sequence: ${lesson.sequence}, Locked: ${isLocked}`);

                            return (
                                <LessonButton
                                    key={lesson.videoId}
                                    id={lesson.videoId}
                                    index={idx}
                                    totalCount={videos.length}
                                    locked={isLocked}
                                    current={lastVideo === lesson.sequence}
                                    percentage={percentage}
                                    link={lesson.videoId}
                                    courseId={courseId}
                                />
                            );
                        })}

                        <div className="relative mt-8"
                        >
                            {(!isChestOpened) &&
                                <div className="absolute -top-6 left-2.5 z-10 animate-bounce rounded-xl border-2 bg-yellow-400 px-3 py-2.5 font-bold uppercase tracking-wide text-white">
                                    Open
                                    <div
                                        className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                                        aria-hidden
                                    />
                                </div>

                            }
                            <img
                                src={isChestOpened ? "images/chest_opened.png" : "images/chest_closed.png"}
                                alt="Treasure Chest"
                                onClick={() => {
                                    if (!isChestOpened) {
                                        setModalOpen(true);
                                    }
                                }}
                                className="mt-4 cursor-pointer w-24 h-24"
                            />
                        </div>
                    </div>
                    {isCertOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsCertOpen(false)}
                                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                                >
                                    &times;
                                </button>

                                {/* Certificate Component */}
                                <div ref={certificateRef}>
                                    <Certificate
                                        username="John Doe"
                                        courseName="Advanced Treasure Hunting"
                                        creatorName="Captain Silver"
                                        issueDate="April 4, 2025"
                                    />
                                </div>

                                {/* Download Button */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={downloadPDF}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                                    >
                                        Download as PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                </FeedWrapper>



                {/* Modal for Chest Opening GIF */}
                <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="relative w-80 h-80">
                        <img src="images/chest_gif.gif" alt="Opening Chest" className="w-full h-full shadow-lg" />
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setIsCertOpen(true);
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Get Your Certificate
                        </button>
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setIsChestOpened(true);
                            }}
                            className="absolute -top-4 -right-4 text-white bg-black rounded-full p-1"
                            aria-label="Close modal"
                        >

                            <IoClose size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LearnPage;