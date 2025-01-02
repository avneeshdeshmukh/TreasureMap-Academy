"use client";
import { useState } from "react";
import CourseCard from "./coursecard";

const CourseForm = ({ closeForm }) => {
  const [courseDetails, setCourseDetails] = useState({
    courseTitle: "",
    description: "",
    thumbnail: null,
  });
  const [submittedCourses, setSubmittedCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseDetails((prev) => ({
        ...prev,
        thumbnail: file,
      }));
    }
  };

  const handleSubmit = () => {
    if (!courseDetails.courseTitle || !courseDetails.description || !courseDetails.thumbnail) {
      alert("Please fill in all fields and upload a thumbnail.");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      const newCourse = {
        ...courseDetails,
        id: Date.now(), // Unique ID for each course
        thumbnailURL: URL.createObjectURL(courseDetails.thumbnail), // For local preview
      };
      setSubmittedCourses((prevCourses) => [...prevCourses, newCourse]); // Add to list of courses
      setCourseDetails({
        courseTitle: "",
        description: "",
        thumbnail: null,
      }); // Reset form
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setSubmittedCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
    }
  };

  return (
    <div className="bg-[#f8f4eb] rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl relative">
      <button
        onClick={closeForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4">Create Course</h3>
      <input
        type="text"
        placeholder="Course Title"
        value={courseDetails.courseTitle}
        onChange={(e) =>
          setCourseDetails((prev) => ({ ...prev, courseTitle: e.target.value }))
        }
        className="border rounded p-2 mb-4 w-full"
      />
      <textarea
        placeholder="Course Description"
        value={courseDetails.description}
        onChange={(e) =>
          setCourseDetails((prev) => ({ ...prev, description: e.target.value }))
        }
        className="border rounded p-2 mb-4 w-full"
      ></textarea>
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailUpload}
        className="mb-4"
      />
      {courseDetails.thumbnail && (
        <p className="text-green-600">Thumbnail uploaded: {courseDetails.thumbnail.name}</p>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={closeForm}
          className="px-4 py-2 bg-gray-300 rounded mr-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      
      {/* Display submitted courses */}
      {submittedCourses.length > 0 && (
  <>
    <h3 className="text-lg font-semibold mt-8 mb-4">Your Courses</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {submittedCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onDelete={() => handleDelete(course.id)}
          onEdit={() => alert("Redirect to edit page")}
        />
      ))}
    </div>
  </>
)}
    </div>
  );
};

export default CourseForm;