"use client";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "./coursecard";


const CourseForm = ({ closeForm }) => {
  const [courseDetails, setCourseDetails] = useState({
    courseTitle: "",
    description: "",
    thumbnail: null,
  });
  const [submittedCourses, setSubmittedCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseDetails((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      setErrors((prev) => ({ ...prev, thumbnail: "" })); // Clear error
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!courseDetails.courseTitle) newErrors.courseTitle = "Course title is required.";
    if (!courseDetails.description) newErrors.description = "Description is required.";
    if (!courseDetails.thumbnail) newErrors.thumbnail = "Thumbnail is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const newCourse = {
      ...courseDetails,
      id: uuidv4(), // Generate a unique ID
      thumbnailURL: URL.createObjectURL(courseDetails.thumbnail),
    };

    setSubmittedCourses((prevCourses) => [...prevCourses, newCourse]);
    setCourseDetails({
      courseTitle: "",
      description: "",
      thumbnail: null,
    });

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input value
    }

    setErrors({});
    setIsSubmitting(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setSubmittedCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
    }
  };

  const handleEdit = (courseId) => {
    router.push(`/mycourses/${courseId}/edit-form`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl relative">
      <button
        onClick={closeForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4">Create Course</h3>

      <div className="mb-4">
        <label className="block font-medium text-gray-700">Course Title</label>
        <input
          type="text"
          placeholder="Enter course title"
          value={courseDetails.courseTitle}
          onChange={(e) =>
            setCourseDetails((prev) => ({
              ...prev,
              courseTitle: e.target.value,
            }))
          }
          className="border rounded p-2 w-full"
        />
        {errors.courseTitle && (
          <p className="text-red-500 text-sm">{errors.courseTitle}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Enter course description"
          value={courseDetails.description}
          onChange={(e) =>
            setCourseDetails((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="border rounded p-2 w-full"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef} // Attach the ref here
          onChange={handleThumbnailUpload}
          className="w-full"
        />
        {courseDetails.thumbnail && (
          <p className="text-green-600">
            Thumbnail uploaded: {courseDetails.thumbnail.name}
          </p>
        )}
        {errors.thumbnail && (
          <p className="text-red-500 text-sm">{errors.thumbnail}</p>
        )}
      </div>

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
          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loader mr-2"></span> // Add spinner or similar loading indicator
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {submittedCourses.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-8 mb-4">Your Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {submittedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={() => handleDelete(course.id)}
                onEdit={(selectedCourse) => handleEdit(selectedCourse.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseForm;