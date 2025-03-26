"use client"
import React, { useState } from 'react';
import { Star, BookOpen, TrendingUp, IndianRupee, User, MessageCircle } from 'lucide-react';

export default function ProgressPage() {
  const [progressData] = useState([
    {
      id: "1",
      title: "Introduction to JavaScript",
      creatorName: "John Doe",
      status: "Published",
      averageRating: 4.5,
      enrollments: 120,
      revenue: 2400,
      numberOfTotalPublishedCourses: 5,
      totalCourses: 8,
      totalEnrollments: 350,
      totalRevenue: 7000,
      comments: ["Great course!", "Very informative", "Needs more examples"],
    },
    {
      id: "2",
      title: "Python for Beginners",
      creatorName: "Jane Smith",
      status: "Draft",
      averageRating: null,
      enrollments: 0,
      revenue: 0,
      numberOfTotalPublishedCourses: 2,
      totalCourses: 3,
      totalEnrollments: 50,
      totalRevenue: 1000,
      comments: [],
    },
    {
        id: "3",
        title: "Angular Advanced",
        creatorName: "Jane Smith",
        status: "Draft",
        averageRating: null,
        enrollments: 0,
        revenue: 0,
        numberOfTotalPublishedCourses: 2,
        totalCourses: 3,
        totalEnrollments: 50,
        totalRevenue: 1000,
        comments: [],
      },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRatingStars = (rating) => {
    if (!rating) return 'N/A';
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5a3b1a] text-center mb-8 border-b-2 pb-4 border-gray-300 uppercase">
          Progress
        </h1>

        {progressData.length === 0 ? (
          <div className="text-center bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-500 text-lg">No course progress data available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {progressData.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{course.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{course.creatorName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">{renderRatingStars(course.averageRating)}</span>
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
                {course.comments.length > 0 && (
                  <div className="p-5 bg-gray-50 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Recent Comments</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {course.comments.slice(0, 3).map((comment, index) => (
                        <li key={index} className="flex items-start">
                          <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
                          {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
