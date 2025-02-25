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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Handle the submit logic
  const handlePublish = () => {
    setShowTermsModal(true);
  };

  const handleSubmitAfterTerms = () => {
    console.log("Form Data Submitted:", formData);
    alert("Form submitted successfully!");
    setShowTermsModal(false);
  };

  // Handle going back
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

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
        <Button onClick={handlePublish} variant="ghost">
          Publish Course
        </Button>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-auto">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            
            <div className="h-64 overflow-y-auto border p-4 mb-4 text-sm">
              <h3 className="font-semibold mb-2">1. Content Guidelines</h3>
              <p className="mb-3">
                By publishing this course, you confirm that all content is original or properly licensed for use. You agree not to publish any content that infringes on intellectual property rights, contains offensive material, or violates our community guidelines.
              </p>
              
              <h3 className="font-semibold mb-2">2. Revenue Sharing</h3>
              <p className="mb-3">
                You understand that revenue generated from your course will be shared according to our current revenue split policy, which may be updated from time to time.
              </p>
              
              <h3 className="font-semibold mb-2">3. Quality Standards</h3>
              <p className="mb-3">
                You agree to maintain a certain level of quality and respond to student inquiries in a timely manner. Courses that consistently receive poor ratings may be subject to review.
              </p>
              
              <h3 className="font-semibold mb-2">4. Distribution Rights</h3>
              <p className="mb-3">
                By publishing your course, you grant us non-exclusive rights to market and distribute your content across our platform and affiliated channels.
              </p>
              
              <h3 className="font-semibold mb-2">5. Modification</h3>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the platform after such modifications constitutes your consent to the updated terms.
              </p>
            </div>
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="agreeTerms" 
                className="mr-2"
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
              />
              <label htmlFor="agreeTerms" className="text-sm">I agree to the terms and conditions</label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowTermsModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitAfterTerms} 
                disabled={!termsAgreed}
                className={!termsAgreed ? "opacity-50 cursor-not-allowed" : ""}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}