"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User, Clock, BookOpen, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Details() {
  const router = useRouter();
  const course = {
    title: "Advanced Web Development with React & Next.js",
    thumbnail: "/images/homelearner.png",
    creator: "Sarah Johnson",
    price: 199,
    description:
      "Master modern web development with React and Next.js. This comprehensive course covers everything from basic concepts to advanced patterns including server-side rendering, API routes, and deployment strategies.",
    duration: "12 weeks",
    level: "Intermediate",
    totalLessons: 48,
    studentsEnrolled: 1234,
  };

  const handleEnroll = () => {
    router.push("/learn");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Banner Section */}
        <div className="relative bg-yellow-500 text-white p-8 min-h-[360px] rounded-lg flex items-center">
          <div className="max-w-[calc(100%-320px)]">
            <h1 className="text-4xl font-extrabold tracking-tight leading-snug font-serif">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-white leading-relaxed tracking-wide font-sans">
              {course.description}
            </p>

            <p className="mt-2 text-yellow-800 text-sm flex items-center space-x-2">
              <span>Created by - {course.creator}</span>
              <span className="text-yellow-800">|</span>
              <span>Language - English</span>
            </p>
          </div>

          {/* Course Info Card */}
          <Card className="absolute top-[-80px] right-5 bg-white text-black w-80 shadow-lg translate-y-1/4">
            <Image
              src={course.thumbnail}
              width={320}
              height={180}
              alt="Course thumbnail"
              className="rounded-t-lg object-cover"
            />
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">₹{course.price}</p>
              </div>

              <Button
                className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-yellow-600 hover:scale-105 hover:shadow-lg"
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>

              <div className="text-sm text-gray-700 space-y-2">
                <p>✓ Full lifetime access</p>
                <p>✓ Access on mobile and desktop</p>
                <p>✓ Certificate of completion</p>
                <p>✓ 30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Details Section */}
        <div className="mt-8 grid grid-cols-3 gap-12">
          <div className="col-span-2 mr-10">
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 transition duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Course Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {course.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-green-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Total Lessons</p>
                    <p className="font-medium text-gray-900">
                      {course.totalLessons} lessons
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart className="text-yellow-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium text-gray-900">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="text-red-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Students Enrolled</p>
                    <p className="font-medium text-gray-900">
                      {course.studentsEnrolled.toLocaleString()} enrolled
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Reviews Section */}
            <div className="mt-8 bg-white border border-gray-300 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Student Reviews
              </h2>

              {/* Review 1 */}
              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/user1.jpg"
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="User 1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  "This course is fantastic! The content is well-structured and easy to follow."
                </p>
              </div>

              {/* Review 2 */}
              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/user2.jpg"
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="User 2"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Jane Smith</p>
                    <p className="text-yellow-500">⭐⭐⭐⭐</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  "Great course! I learned so much about Next.js. Highly recommended."
                </p>
              </div>

              {/* Write a Review Button */}
              <div className="mt-4">
                <Button className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-yellow-600 hover:scale-105 hover:shadow-lg">
                  Write a Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
