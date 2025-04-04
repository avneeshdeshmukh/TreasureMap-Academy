"use client";

import { auth } from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Feedback() {
  const firestore = getFirestore();
  const { courseId } = useParams();
  const userId = auth.currentUser.uid;

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const courseProgressRef = doc(firestore, "courseProgress", userId);
      const courseProgressSnap = await getDoc(courseProgressRef);
      const data = courseProgressSnap.data();
      console.log(data.courses[courseId].feedback);
      setFeedbacks(data.courses[courseId].feedback);
    }

    fetchFeedbacks();
  }, [courseId])

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

  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 max-h-fit">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{formatTimestamp(feedback.timestamp)}</h3>
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
