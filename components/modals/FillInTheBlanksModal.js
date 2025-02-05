// components/modals/FillInTheBlanksModal.js
"use client";

import { useState, useCallback } from "react";

const FillInTheBlanksModal = ({ questionData, onSubmit, onClose }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = useCallback(() => {
    // Compare the answers in a case-insensitive manner after trimming any extra spaces.
    if (userAnswer.trim().toLowerCase() !== questionData.correctAnswer.toLowerCase()) {
      setShowError(true);
    } else {
      onSubmit(userAnswer);
      onClose();
    }
  }, [userAnswer, questionData, onSubmit, onClose]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {/* Title */}
          <h2 className="text-xl font-bold mb-2">Fill in the Blanks Quiz</h2>
          {/* Pirate Image */}
          <img
            src="/images/solo2.png" // update with your actual image path
            alt="Enthusiastic pirate kid"
            className="w-24 h-24 object-contain mx-auto mb-1"
          />
          {/* Quiz Question with a blank placeholder */}
          <p className="mb-2 text-center">
            {questionData.question.replace("____", "____")}
          </p>
          {/* Input box */}
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer here"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Error popup overlay with a high z-index */}
      {showError && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-4 rounded shadow-md w-80 text-center">
            <p className="mb-4">Incorrect answer, try again.</p>
            <button
              onClick={() => setShowError(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FillInTheBlanksModal;
