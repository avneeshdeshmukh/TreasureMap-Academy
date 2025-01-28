"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CourseForm from "./courseform";
import Drafts from "./drafts";

const MyCourses = () => {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [drafts, setDrafts] = useState([]);

  const courses = [
    { id: 1, title: "React Basics", enrollments: 50 },
    { id: 2, title: "Advanced JavaScript", enrollments: 30 },
  ];

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      setSubmittedCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
    }
  };

  const handleEdit = (courseid) => {
    console.log("Edit course with ID:", courseid);
    // Example: Navigate to an edit page
    router.push(`/create/courses/${courseid}/edit-form`);
  };

  const handleCourseSubmit = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("refreshDrafts")); // Custom event to notify Drafts
    }
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-2xl p-6 mt-6 mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#5a3b1a] mb-6">My Courses</h1>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-[#f8f4eb] p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#5a3b1a]">
                {course.title}
              </h2>
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
        <CourseForm
          closeForm={() => setIsFormOpen(false)}
          onCourseSubmit={handleCourseSubmit}
        />
      )}
      {/* Drafts Component */}
      <Drafts
        onEdit={handleEdit}
      />

    </div>
  );
};

export default MyCourses;