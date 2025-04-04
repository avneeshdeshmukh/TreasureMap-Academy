"use client";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from './header';
import YourCourses from '@/components/creatorDashboard/yourcourses';
import CreatorStats from '@/components/creatorDashboard/creatorStats';
import FeaturedCourses from "@/components/creatorDashboard/featuredcourses";
import { auth } from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";

const CreatorDashboard = () => {
    const firestore = getFirestore();
    const userId = auth.currentUser.uid;
    const userRef = doc(firestore, "users", userId);
    const courseProgressRef = doc(firestore, "courseProgress", userId);
    const [courseProgress, setCourseProgress] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchCourseProgress = async () => {
            try {
                const courseProSnap = await getDoc(courseProgressRef);
                const userSnap = await getDoc(userRef);
                setCourseProgress(courseProSnap.data());
                setUser(userSnap.data());
            } catch (err) {
                console.log(err);
            }
        };

        fetchCourseProgress();
    }, [userId]);

    return (
        courseProgress &&
        <FeedWrapper>
            <Header user={user} />
            <YourCourses data={courseProgress} />
            <CreatorStats data={courseProgress} />
            {/* <FeaturedCourses /> */}
        </FeedWrapper>
    );
};

export default CreatorDashboard; 