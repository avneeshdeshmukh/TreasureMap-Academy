"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import CourseDetailsForm from "@/components/mycreatecourse/course-form-2/course-details-form";

export default function EditFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    courseDetails: {},
    videos: [],
  });

  // Handle the submit logic
  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData); 
    alert("Form submitted successfully!");
    router.push("/mycourses"); 
  };

  // Handle going back
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  const handleNextFromCourseDetails = (data) => {
    setFormData((prev) => ({
      ...prev,
      courseDetails: data,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>

      {/* Course Details Form */}
      <CourseDetailsForm
      />

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
