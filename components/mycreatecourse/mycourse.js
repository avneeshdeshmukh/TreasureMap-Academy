"use client";
import { useState } from "react";
import CourseForm from './courseform'


const MyCourses = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const courses = [
    { id: 1, title: "React Basics", enrollments: 50 },
    { id: 2, title: "Advanced JavaScript", enrollments: 30 },
  ];

  return (
    <div>
    <div className="bg-[#f8f4eb] rounded-lg shadow-md p-6 mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-[#5a3b1a] mb-6">My Courses</h1>
      
      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#5a3b1a]">{course.title}</h2>
            <p className="text-gray-500">Enrollments: {course.enrollments}</p>
          </div>
        ))}
      </div>
      
      {/* Create New Course Button */}
      <button
        className="bg-[#ffc107] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800]"
        onClick={() => setIsFormOpen(true)}
      >
        Create New Course
      </button>
      </div>

      {/* Course Form */}
      
      {isFormOpen && (
          <CourseForm closeForm={() => setIsFormOpen(false)} />
      )}
        
      </div>
  );
};

export default MyCourses;
