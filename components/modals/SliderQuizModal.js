// components/modals/SliderQuizModal.js
"use client";

import { useState } from "react";

const SliderQuizModal = ({ questionData, onSubmit, onClose }) => {
  const [selectedValue, setSelectedValue] = useState(50); // Default to midpoint
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = selectedValue >= questionData.correctRange[0] && 
                    selectedValue <= questionData.correctRange[1];
    setIsCorrect(correct);
    setShowResult(true);
    
    
    setTimeout(() => {
      onSubmit(correct);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Percentage Quiz</h2>
        <p className="mb-4">{questionData.question}</p>
        
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

        {showResult && (
          <div className={`mt-4 p-2 rounded text-center ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? "Correct! 🎉" : "Incorrect 😞"}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          disabled={showResult}
        >
          {showResult ? (isCorrect ? "Submitting..." : "Try Again") : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SliderQuizModal;