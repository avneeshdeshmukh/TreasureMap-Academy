"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftCircle } from "lucide-react";

export default function Information() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#5a3b1a] mb-6"
        >
          <ArrowLeftCircle className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back</span>
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[#5a3b1a] mb-6">
          Guide to Creating and Publishing Courses
        </h1>

        {/* Step 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#5a3b1a]">1. Course Details</h2>
          <p className="text-gray-600 mt-2">
            Start by providing essential details about your course:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Course Title</li>
            <li>Category & Difficulty Level</li>
            <li>Course Description (clear and engaging)</li>
            <li>Thumbnail (recommended size: 1280x720)</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#5a3b1a]">2. Upload Course Videos</h2>
          <p className="text-gray-600 mt-2">
            Add structured videos to cover your course content. Ensure:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Each video has clear audio and high resolution</li>
            <li>Videos are arranged in a logical sequence</li>
            <li>Upload times may vary based on file size</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#5a3b1a]">3. Add Interactive Quizzes</h2>
          <p className="text-gray-600 mt-2">
            Engage learners by embedding quizzes at specific timestamps:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Each video must have at least one interactive quiz</li>
            <li>Quizzes appear as pop-ups, requiring learners to answer before proceeding</li>
            <li>Use multiple-choice questions or short answers</li>
          </ul>
        </div>

        {/* Step 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#5a3b1a]">4. Preview & Save as Draft</h2>
          <p className="text-gray-600 mt-2">
            Before submitting, review your course:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Ensure all videos and quizzes are correctly placed</li>
            <li>Save your course as a draft for later modifications</li>
            <li>Check for any missing or incorrect details</li>
          </ul>
        </div>

        {/* Step 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#5a3b1a]">5. Submit for Approval</h2>
          <p className="text-gray-600 mt-2">
            Once your course is ready, submit it for admin approval:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Admins will review content and quizzes</li>
            <li>Courses must meet quality guidelines before publishing</li>
            <li>Approval status will be updated in your dashboard</li>
          </ul>
        </div>

        {/* Step 6 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#5a3b1a]">6. Publish & Earn</h2>
          <p className="text-gray-600 mt-2">
            Once approved, your course goes live! Start earning through:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Course enrollments</li>
          </ul>
        </div>

        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mt-6">
          <strong>Note:</strong> Course verification by admins takes between <strong>3 to 6 days</strong>. Please ensure all content meets the guidelines to avoid delays.
        </div>


        {/* Footer */}
        <div className="text-gray-700 mt-8 text-center border-t pt-4">
          Need help? Contact <span className="text-[#5a3b1a] font-semibold">treasuremapacademy@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

