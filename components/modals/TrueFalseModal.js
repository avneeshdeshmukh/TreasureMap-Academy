// components/modals/TrueFalseModal.js
"use client";

import { useState, useCallback } from "react";
import { Button } from "../ui/button";

const TrueFalseModal = ({ questionData, onSubmit, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleSubmit = useCallback(() => {
    if (selectedOption !== questionData.correctAnswer) {
      setShowError(true);
    } else {
      onSubmit(selectedOption);
      onClose();
    }
  }, [selectedOption, questionData, onSubmit, onClose]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {/* Title */}
          <h2 className="text-xl font-bold mb-2">True or False Quiz</h2>
          {/* Pirate Image */}
          <img
            src="/images/solo3.png"  
            alt="Pirate kid"
            className="w-24 h-24 object-contain mx-auto mb-1"          />
          {/* Quiz Question */}
          <p className="mb-4 text-center">{questionData.question}</p>
          <div className="space-y-2">
            {["True", "False"].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`tf-option-${index}`}
                  name="trueFalse"
                  value={option.toLowerCase()}
                  checked={selectedOption === option.toLowerCase()}
                  onChange={() => setSelectedOption(option.toLowerCase())}
                  className="form-radio"
                />
                <label htmlFor={`tf-option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <Button
            variant="sidebarOutline"
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Error popup overlay */}
      {showError && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-4 rounded shadow-md w-80 text-center">
            <p className="mb-4">Incorrect answer, try again.</p>
            <Button
              onClick={() => setShowError(false)}
              variant = "danger"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TrueFalseModal;
