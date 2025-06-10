"use client";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/app/context/AuthProvider";
import { useState, useEffect } from "react";
import React from "react";

const firestore = getFirestore();

const Drafts = ({ onEdit }) => {
  const [courses, setCourses] = useState([]); // State to store courses
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const { user } = useAuth(); // Get the current user
  const userRef = doc(firestore, "users", user.uid);

  const fetchUserCourses = async () => {
    try {
      if (!user) {
        throw new Error("User is not logged in.");
      }

      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Reference the 'courses' collection
      const coursesRef = collection(firestore, "courses");
      console.log(userData.username)

      // Query courses where username matches the current user's username
      const q = query(
        coursesRef,
        where("creatorId", "==", userData.uid),
        where("isPublished", "==", false)
      );
      const querySnapshot = await getDocs(q);

      // Fetch the query snapshot
      const courseProgressRef = doc(firestore, "courseProgress", user.uid);
      const courseProSnap = await getDoc(courseProgressRef);
      const courseProData = courseProSnap.exists() ? courseProSnap.data() : { courses: {} };

      const courseProgressMap = courseProData.courses ?? {};

      // Extract course data, filtering based on the conditions
      const userCourses = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) // Include the document ID
        .filter(course => {
          const courseId = course.id;
          // Check if the course is in courseProData.course
          return !(courseId in courseProgressMap) || courseProgressMap[courseId]?.status === "rejected";// Include courses not present in courseProData.course
        });

      return userCourses; // Return the array of courses
    } catch (error) {
      console.error("Error fetching user courses:", error);
      return [];
    }
  };

  useEffect(() => {
    // Fetch courses on component mount
    const loadCourses = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const userCourses = await fetchUserCourses();
        setCourses(userCourses); // Update state with fetched courses
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadCourses();

    const handleRefresh = () => {
      loadCourses();
    };
    window.addEventListener("refreshDrafts", handleRefresh);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("refreshDrafts", handleRefresh);
    };
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Course Drafts
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No draft courses yet. Create your first course above!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Course Drafts
          </h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            {courses.length} {courses.length === 1 ? "Draft" : "Drafts"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {course.description.split(" ").slice(0, 25).join(" ")}
                  {course.description.split(" ").length > 25 ? "..." : ""}
                </p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => onEdit(course.courseId)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drafts;
