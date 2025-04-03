"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  BookOpen,
  TrendingUp,
  IndianRupee,
  User,
  MessageCircle,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function ProgressPage() {
  const firestore = getFirestore();
  const userId = auth.currentUser.uid;
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);
  const courseProgressRef = doc(firestore, "courseProgress", userId);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user-specific course progress
        const progressSnapshot = await getDoc(courseProgressRef);
        const progressData = progressSnapshot.data();
        let courseArray = [];
        const courses = Object.values(progressData.courses);
        for (const course of courses) {
          courseArray.push(course);
        }

        setCourses(courseArray);
        setCourseProgress(progressData);
        console.log(progressData);
      } catch (err) {
        console.log("Failed to fetch data: " + err.message);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "In Verification":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5a3b1a] text-center mb-8 border-b-2 pb-4 border-gray-300 uppercase">
          Progress
        </h1>

        {courses.length < 0 ? (
          <div className="text-center bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-500 text-lg">
              No course progress data available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h2>

                  <div className="flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {course.status}
                    </span>

                    <button
                      className="text-xs font-medium text-gray-900 bg-yellow-400 px-3 py-1 rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-yellow-500 hover:shadow-md"
                      onClick={() =>
                        router.push(`create/${course.id}/feedback`)
                      }
                    >
                      View Feedback
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{course.creator}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">
                      {course.ratings.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span>{course.enrollments} Enrollments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-5 w-5 text-green-500" />
                      <span>₹{course.revenue} Revenue</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
