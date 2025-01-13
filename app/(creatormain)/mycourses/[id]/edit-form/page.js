"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import CourseDetailsForm from "@/components/mycreatecourse/course-form-2/course-details-form";
// import VideoUploadForm from "@/components/mycreatecourse/course-form-2/video-upload-form";
// import ReviewSubmitForm from "@/components/mycreatecourse/course-form-2/review-submit-form";

export default function EditFormPage() {
  const router = useRouter(); // Initialize useRouter
  const [page, setPage] = useState(1); // State to track the current page of the form
  const [formData, setFormData] = useState({
    courseDetails: {}, // Data from CourseDetailsForm
    videos: [], // Array of videos with timestamps and quizzes
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data })); // Merge new data with existing
    setPage((prev) => prev + 1); // Go to the next page
  };

  const handlePrevious = () => {
    setPage((prev) => prev - 1); // Go to the previous page
  };

  // Final submission logic
  const handleFinalSubmit = (data) => {
    console.log("Final form data submitted:", data);
    // Redirect to the payment page after form submission
    router.push("/payment"); // Navigate to the payment page
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {page === 1 && (
        <CourseDetailsForm
          initialData={formData.courseDetails}
          onNext={(data) => handleNext({ courseDetails: data })}
        />
      )}
      {/* {page === 2 && (
        <VideoUploadForm
          totalVideos={formData.courseDetails.totalVideos} // Pass total videos from courseDetails
          initialData={formData.videos}
          onNext={(data) => handleNext({ videos: data })}
          onPrevious={handlePrevious}
        />
      )} */}
      {/* {page === 3 && (
        <ReviewSubmitForm
          formData={formData}
          onSubmit={handleFinalSubmit} // Update this to use handleFinalSubmit
          onPrevious={handlePrevious}
        />
      )} */}

      
    </div>
  );
}
