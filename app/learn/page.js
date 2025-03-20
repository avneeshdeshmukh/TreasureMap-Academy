"use client"
import { FeedWrapper } from "@/components/feed-wrapper";
import { Stats } from "./stats";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { StreakIcons } from "@/components/streak-icons";
import { Header } from "./header";
import { LessonButton } from "./lesson-button";
import LeaderboardPos from "./leaderboard-position";
import { doc, getFirestore, collection, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import { useState, useEffect } from "react";
import { setLatestCourse } from "@/lib/utils";

const learnPage = () => {
    const firestore = getFirestore();
    const { user } = useAuth();

    const userRef = doc(firestore, "users", user.uid);
    const userProgRef = doc(firestore, "userProgress", user.uid);

    const [courseId, setCourseId] = useState(null);
    const [topCourses, setTopCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [lastVideo, setLastVideo] = useState(0);
    const [percentage, setPercentage] = useState(0);

    const fetchUserDetails = async () => {
        const usr = await getDoc(userRef);
        if (!usr.exists()) {
            console.log("User not found");
            return;
        }

        const usrData = usr.data();
        setUserData(usrData);


        // Check if enrolledCourses exist and if it includes courseId
        setCourseId(usrData.enrolledCourses?.[0] || null);
        if (usrData.enrolledCourses?.length <= 3)
            setTopCourses(usrData.enrolledCourses)
        else if (usrData.enrolledCourses?.length > 3)
            setTopCourses(usrData.enrolledCourses.slice(0, 3))
    };

    const fetchVideos = async () => {
        if (!courseId) return; // Ensure courseId is available

        const videosRef = collection(firestore, "videos"); // Reference to "videos" collection
        const q = query(videosRef, where("course", "==", courseId)); // Filter by courseId
        console.log(q);

        try {
            const querySnapshot = await getDocs(q);
            const videosList = querySnapshot.docs.map(doc => ({
                videoId: doc.data().videoId,
                ...doc.data(),
            }));
            videosList.sort((a, b) => a.sequence - b.sequence);
            setVideos(videosList); // Store videos in state
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
            const last = progData?.courseProgress?.[courseId]?.currentVideo || 1; // Default to 1 if not found
            setLastVideo(last);
            const videoNotesRef = doc(firestore, "videoNotes", `${videos[last - 1].videoId}_${user.uid}`);
            const vnSnap = await getDoc(videoNotesRef);
            console.log(vnSnap.data());
            if(vnSnap.exists()){
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

    const handleCourseSelect = async (selectedCourse) => {
        // Update topCourses and set the title to the selected course
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

    if (userProgress && topCourses.length !== 0) {
        return (
            <div className="flex flex-row-reverse gap-[48px] px-6" >
                <StickyWrapper>
                    <StreakIcons streak={39} coins={65} />
                    <Stats userProgress={userProgress} />
                    <LeaderboardPos />
                </StickyWrapper>
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

                    </div>
                </FeedWrapper>
            </div>
        )
    }

}
export default learnPage;