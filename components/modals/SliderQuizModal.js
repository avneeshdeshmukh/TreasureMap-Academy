// components/modals/SliderQuizModal.js
"use client";

import { useState } from "react";

const SliderQuizModal = ({ questionData, onSubmit, onClose }) => {
  const [selectedValue, setSelectedValue] = useState(50); // Default to midpoint
  const [showError, setShowError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct =
      selectedValue >= questionData.correctRange[0] &&
      selectedValue <= questionData.correctRange[1];
    
    if (correct) {
      setIsCorrect(true);
      onSubmit(true);
      onClose();
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {/* Title */}
          <h2 className="text-xl font-bold mb-2 text-center">Percentage Quiz</h2>

          {/* Pirate Image */}
          <img
            src="/images/solo4.png"
            alt="Pirate kid"
            className="w-24 h-24 object-contain mx-auto mb-3"
          />

          {/* Quiz Question */}
          <p className="mb-4 text-center">{questionData.question}</p>

          {/* Slider Input */}
          <div className="w-full mb-4">
            <div className="flex justify-between mb-2">
              <span>0%</span>
              <span className="text-lg font-semibold">{selectedValue}%</span>
              <span>100%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedValue}
              onChange={(e) => setSelectedValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Error popup overlay */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
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

export default SliderQuizModal;
