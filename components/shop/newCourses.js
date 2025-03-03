"use client";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "@/components/shop/course-card";
import { auth } from "@/lib/firebase";

const NewCourses = () => {
    const firestore = getFirestore();
    
    const sliderRef = useRef(null);
    const [courses, setCourses] = useState([]);
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

    const fetchPublishedCourses = async () => {
        try {
            const coursesRef = collection(firestore, "courses");
            const q = query(coursesRef, where("isPublished", "==", true));
            const querySnapshot = await getDocs(q);
    
            const publishedCourses = await Promise.all(
                querySnapshot.docs.map(async (course) => {
                    const courseData = course.data();
                    const thumbnailUrl = await fetchThumbnailUrl(courseData.thumbnailURL);
                    return {
                        id: course.id,
                        ...courseData,
                        thumbnailURL: thumbnailUrl,  // ✅ Use the fetched URL
                    };
                })
            );
    
            setCourses(publishedCourses);
        } catch (error) {
            console.error("Error fetching published courses:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchPublishedCourses();
    }, []);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="text-2xl font-bold">New Courses</h2>
                {/* Navigation Buttons */}
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

            {/* Courses Slider */}
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
                            publishedDate={course.publishedDate}
                            courseLink={`/courses/${course.id}`}
                            buttonLabel="Enroll"
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center">No courses available.</p>
            )}
        </div>
    );
};

export default NewCourses;
