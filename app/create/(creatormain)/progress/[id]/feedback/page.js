"use client";

import { useState } from "react";

export default function Feedback() {
  const feedbacks = [
    {
      adminName: "John Doe",
      timestamp: "2025-04-03T12:30:00Z",
      message:
        "The course structure is well-planned, but the introduction module lacks clarity. Consider adding a short video explaining the course flow. Also, the quiz in Lesson 3 seems too difficult; try balancing the difficulty level. Additionally, some sections seem to be missing references. You might want to include additional resources for further reading.",
    },
    {
      adminName: "Jane Smith",
      timestamp: "2025-04-02T15:45:00Z",
      message:
        "Great effort! However, the video quality in Module 2 needs improvement. Additionally, some timestamps for quizzes are misplaced—double-check them for better learner experience. Furthermore, it might be helpful to provide more interactive examples so learners can grasp concepts better.",
    },
    {
      adminName: "Michael Brown",
      timestamp: "2025-04-01T10:15:00Z",
      message:
        "Ensure that all captions are correctly synchronized with the videos. Also, consider adding more real-world examples to engage learners better. Try reducing background noise in some of the videos to enhance clarity. You could also provide downloadable notes for key concepts discussed in the course.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#5a3b1a] text-center mb-6">Admin Feedback</h1>

      {feedbacks.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500 text-lg">No feedback available for this course.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback, index) => (
            <FeedbackCard key={index} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ feedback }) {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 150;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 max-h-fit">
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{feedback.adminName}</h3>
        <span className="text-xs text-gray-500">{new Date(feedback.timestamp).toLocaleString()}</span>
      </div>
      <p className="text-gray-700 leading-relaxed">
        {expanded ? feedback.message : `${feedback.message.slice(0, previewLength)}... `}
        {feedback.message.length > previewLength && (
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "More..."}
          </button>
        )}
      </p>
    </div>
  );
}
