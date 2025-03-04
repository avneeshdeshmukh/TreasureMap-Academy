"use client";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "@/components/shop/course-card";
import { auth } from "@/lib/firebase";

const EnrolledCourses = () => {

    const firestore = getFirestore();
    const userId = auth.currentUser.uid;
    const userDocRef = doc(firestore, "users", userId);
    const sliderRef = useRef(null);
    const [courses, setCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchThumbnailUrl = async (thumbnailPath) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch("/api/getPresignedUrl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ filepath: thumbnailPath }),
            });

            if (!response.ok) throw new Error("Failed to fetch thumbnail URL");

            const data = await response.json();
            return data.videoUrl;
        } catch (err) {
            console.error("Error fetching thumbnail URL:", err);
            setError(err.message);
            return null;
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                setCourses([]);
                return;
            }

            setUserData(userDoc.data());

            const enrolledCourseIds = userDoc.data().enrolledCourses || [];

            if (enrolledCourseIds.length === 0) {
                setCourses([]);
                return;
            }

            const coursesRef = collection(firestore, "courses");
            const courseDocs = await Promise.all(
                enrolledCourseIds.map((courseId) => getDoc(doc(coursesRef, courseId)))
            );

            const enrolledCourses = await Promise.all(
                courseDocs.map(async (courseDoc) => {
                    if (!courseDoc.exists()) return null;
                    const courseData = courseDoc.data();

                    // Fetch pre-signed URL for the thumbnail
                    const thumbnailUrl = await fetchThumbnailUrl(courseData.thumbnailURL);

                    return {
                        id: courseDoc.id,
                        ...courseData,
                        thumbnailURL: thumbnailUrl,  // Use pre-signed URL
                    };
                })
            );

            setCourses(enrolledCourses.filter(Boolean));
        } catch (err) {
            console.error("Error fetching enrolled courses:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    

    return (
        <div className="w-full py-6">
            <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="text-2xl font-bold">Enrolled Courses</h2>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => scroll("left")}
                        className="hover:bg-gray-700"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => scroll("right")}
                        className="hover:bg-gray-700"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <p className="text-center">Loading courses...</p>
            ) : courses.length > 0 ? (
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            title={course.title}
                            thumbnail={course.thumbnailURL}
                            enrolledDate={course.enrolledDate || "N/A"}
                            courseId={course.id}
                            buttonLabel="Continue Learning"
                            userData={userData}
                            userDocRef={userDocRef}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center">No courses available.</p>
            )}
        </div>
    );
};

export default EnrolledCourses;
