"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CourseDetailsForm from "@/components/mycreatecourse/course-form-2/course-details-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DeleteModal from "@/components/mycreatecourse/course-form-2/DeleteModal";

export default function EditFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    courseDetails: {},
    videos: [],
  });
  const[showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle the submit logic
  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
    alert("Form submitted successfully!");
  };

  // Handle going back
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  // const handleNextFromCourseDetails = (data) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     courseDetails: data,
  //   }));
  // };

  const handleDelete = () => {
    console.log("Course deleted!");
    // Perform course deletion logic here (e.g., API request)
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ">Edit Course</h1>
        <div className="p-2 rounded-full hover:bg-red-500 transition"
         onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="cursor-pointer text-gray-700" />
        </div>
      </div>
      {/* Course Details Form */}
      <CourseDetailsForm />

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
          onClick={handleBack}
        >
          Back
        </button>
        <Button onClick={handleSubmit} variant="ghost">
          Publish Course
        </Button>
      </div>

       {/* Delete Modal */}
       <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
