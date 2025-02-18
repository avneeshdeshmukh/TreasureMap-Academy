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

    const [courseId, setCourseId] = useState(null);
    const [topCourses, setTopCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [videos, setVideos] = useState([]);

    const fetchUserDetails = async () => {
        const usr = await getDoc(userRef);
        if (!usr.exists()) {
            console.log("User not found");
            return;
        }

        const usrData = usr.data();
        setUserData(usrData);
        console.log("Enrolled Courses:", usrData.enrolledCourses);


        // Check if enrolledCourses exist and if it includes courseId
        console.log(usrData.enrolledCourses?.[0]);
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
            console.log(videosList);
            setVideos(videosList); // Store videos in state
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };


    useEffect(() => {
        fetchUserDetails();
    }, [user])

    useEffect(() => {
        fetchVideos();
    }, [courseId])

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

    const handleAfterSelect = async () =>{
        fetchUserDetails();
        fetchVideos();
    }


    const lessons = [
        { id: "1", index: 0, totalCount: 14, locked: false, current: false, percentage: 100 },
        { id: "2", index: 1, totalCount: 14, locked: false, current: false, percentage: 100 },
        { id: "3", index: 2, totalCount: 14, locked: false, current: true, percentage: 60 },
        { id: "4", index: 3, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "5", index: 4, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "6", index: 5, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "7", index: 6, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "8", index: 7, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "9", index: 8, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "10", index: 9, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "11", index: 10, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "12", index: 11, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "13", index: 12, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "14", index: 14, totalCount: 14, locked: true, current: false, percentage: 0 },
    ];

    if (topCourses.length !== 0) {
        return (
            <div className="flex flex-row-reverse gap-[48px] px-6" >
                <StickyWrapper>
                    <StreakIcons streak={39} coins={65} />
                    <Stats />
                    <LeaderboardPos />
                </StickyWrapper>
                <FeedWrapper>
                    <Header topCourses={topCourses} onCourseSelect={handleCourseSelect} afterSelect={handleAfterSelect} />
                    <div className="relative flex flex-col items-center">
                        {videos.map((lesson, idx) => (
                            <LessonButton
                                key={lesson.videoId}
                                id={lesson.videoId}
                                index={idx}
                                totalCount={videos.length}
                                locked={false}
                                current={false}
                                percentage={0}
                                link={lesson.videoId}
                                courseId={courseId}
                            />
                        ))}
                    </div>
                </FeedWrapper>
            </div>
        )
    }

}
export default learnPage;