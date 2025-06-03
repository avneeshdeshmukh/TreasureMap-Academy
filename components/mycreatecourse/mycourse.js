"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseForm from "./courseform";
import Drafts from "./drafts";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, getDoc, getDocs, where, query, collection } from "firebase/firestore";

const MyCourses = () => {
  const firestore = getFirestore();
  const router = useRouter();
  const userId = auth.currentUser.uid;
  const userRef = doc(firestore, "users", userId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [inVerification, setInVerification] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      const courseProgressRef = doc(firestore, "courseProgress", userId);
      const courseProSnap = await getDoc(courseProgressRef);
      const courseProData = courseProSnap.exists() ? courseProSnap.data() : { courses: {} };
      
      const courses = courseProData.courses || {};
      // Extract course data, filtering based on the conditions
      const verified = Object.values(courses).filter(course => course.status === "verification");
      const published = Object.values(courses).filter(course => course.status === "published");

      console.log(published)
      console.log(verified)
      setCourses(published);
      setInVerification(verified);
    }

    fetchCourses();
  }, [userId])

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
    courses &&
    <div>
      <div className="bg-white rounded-lg shadow-2xl p-6 mt-6 mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#5a3b1a] mb-6">My Courses</h1>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.courseId} className="bg-[#f8f4eb] p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-[#5a3b1a]">{course.title}</h2>
                <p className="text-gray-500">Enrollments: {course.enrollments}</p>
              </div>
            ))
          ) : (
            <p>You have no published courses...</p>
          )}
        </div>


        {/* Create New Course Button */}
        <button
          className="bg-[#ffc107] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800]"
          onClick={() => setIsFormOpen(true)}
        >
          Create New Course
        </button>
      </div>


      {inVerification.length > 0 &&
        <div className="bg-white rounded-lg shadow-2xl p-6 mt-6 mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#5a3b1a] mb-6">Courses in Verification</h1>

          {/* Course List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {inVerification.length > 0 ? (
              inVerification.map((course) => (
                <div key={course.courseId} className="bg-[#f8f4eb] p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-[#5a3b1a]">{course.title}</h2>
                  <p className="text-sm text-green-600">In Verification</p>
                </div>
              ))
            ) : (
              <p>You have no published courses...</p>
            )}
          </div>
        </div>}

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