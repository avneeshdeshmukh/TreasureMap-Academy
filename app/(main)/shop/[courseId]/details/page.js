"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Clock, BookOpen, BarChart } from "lucide-react";
import Image from "next/image";

export default function Details() {
  const course = {
    title: "Advanced Web Development with React & Next.js",
    thumbnail: "/images/homelearner.png",
    creator: "Sarah Johnson",
    price: 199,
    description:
      "Master modern web development with React and Next.js. This comprehensive course covers everything from basic concepts to advanced patterns including server-side rendering, API routes, and deployment strategies. Perfect for developers looking to level up their frontend skills.",
    duration: "12 weeks",
    level: "Intermediate",
    totalLessons: 48,
    studentsEnrolled: 1234,
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Web Development
              </span>
              <span>•</span>
              <span>Updated January 2025</span>
            </div>
            <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Main content area */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left column - Course info */}
              <div className="col-span-2 space-y-6">
                {/* Thumbnail */}
                <div className="relative w-3/6 h-auto rounded-xl overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    width={100}
                    height={100}
                    alt="Course thumbnail"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Course description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">About This Course</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Total Lessons</p>
                      <p className="font-medium">
                        {course.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-medium">
                        {course.studentsEnrolled.toLocaleString()} enrolled
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Pricing card */}
              <div className="col-span-1">
                <div className="sticky top-4 bg-gray-50 rounded-xl p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">₹{course.price}</p>
                    <p className="text-gray-500">One-time payment</p>
                  </div>

                  <Button className="ml-7">Enroll Now</Button>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-3">
                      <User size={20} />
                      <div>
                        <p className="font-medium">Instructor</p>
                        <p className="text-sm text-gray-600">
                          {course.creator}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 space-y-2">
                    <p>✓ Full lifetime access</p>
                    <p>✓ Access on mobile and desktop</p>
                    <p>✓ Certificate of completion</p>
                    <p>✓ 30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
