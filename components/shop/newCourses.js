"use client";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "@/components/shop/course-card";


const NewCourses = () => {
    const firestore = getFirestore();
    
    const sliderRef = useRef(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPublishedCourses = async () => {
        try {
            const coursesRef = collection(firestore, "courses");
            const q = query(coursesRef, where("isPublished", "==", true));
            const querySnapshot = await getDocs(q);

            const publishedCourses = querySnapshot.docs.map((course) => ({
                id: course.id,
                ...course.data(),
            }));

            setCourses(publishedCourses);
        } catch (error) {
            console.error("Error fetching published courses:", error);
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
                            thumbnail={course.thumbnail}
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
