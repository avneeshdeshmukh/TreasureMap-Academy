"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "@/components/shop/course-card";

const EnrolledCourses = ({ courses }) => {
    const sliderRef = useRef(null);

    // Dummy data
    const enrolledCourses = [
        { 
            title: "React Fundamentals", 
            thumbnail: "/images/bg.png", 
            enrolledDate: "2024-02-10", 
            courseLink: "/courses/react-fundamentals" 
        },
        { 
            title: "Advanced JavaScript", 
            thumbnail: "/images/bg.png", 
            enrolledDate: "2024-01-15", 
            courseLink: "/courses/advanced-javascript" 
        },
        { 
            title: "Node.js Basics", 
            thumbnail: "/images/bg.png", 
            enrolledDate: "2024-03-05", 
            courseLink: "/courses/nodejs-basics" 
        },
        { 
            title: "Django Advanced", 
            thumbnail: "/images/bg.png", 
            enrolledDate: "2024-03-05", 
            courseLink: "/courses/nodejs-basics" 
        }
    ];

    // Use dummy data if no courses are provided
    const displayedCourses = courses && courses.length > 0 ? courses : enrolledCourses;

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
                <h2 className="text-2xl font-bold">Enrolled Courses</h2>
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
            <div
                ref={sliderRef}
                className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 px-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {displayedCourses.map((course, index) => (
                    <CourseCard
                        key={index}
                        title={course.title}
                        thumbnail={course.thumbnail}
                        enrolledDate={course.enrolledDate}
                        courseLink={course.courseLink}
                        buttonLabel="Continue Learning"
                    />
                ))}
            </div>
        </div>
    );
};

export default EnrolledCourses;
