"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const MCQModal = ({ questionData, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!isAnswered) {
      setIsAnswered(true);
    } else {
      onSubmit();
    }
  }, [isAnswered, onSubmit]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-100 to-white p-8 rounded-2xl shadow-2xl w-[500px] max-w-lg"
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            🏴‍☠️ Multiple Choice Quiz 🏴‍☠️
          </h2>

          {/* Pirate Image */}
          <motion.img
            src="/images/solo4.png"
            alt="Pirate Kid"
            className="w-28 h-28 object-contain mx-auto mb-4"
            initial={{ y: -10 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* Question */}
          <p className="mb-4 text-lg text-center font-medium text-gray-700">
            {questionData.question}
          </p>

          {/* Options - Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {questionData.options.map((option, index) => {
              let bgColor = "bg-white border-gray-300"; // Default
              if (isAnswered) {
                if (option === questionData.correctAnswer) {
                  bgColor = "bg-green-400 border-green-600 text-white";
                } else if (option === selectedOption) {
                  bgColor = "bg-red-400 border-red-600 text-white";
                }
              } else if (selectedOption === option) {
                bgColor = "bg-yellow-400 border-yellow-600";
              }

              return (
                <motion.div
                  key={index}
                  className={`cursor-pointer p-3 rounded-lg border text-center text-lg font-medium transition-all ${bgColor} ${
                    isAnswered ? "pointer-events-none" : ""
                  }`}
                  whileHover={!isAnswered ? { scale: 1.05 } : {}}
                  whileTap={!isAnswered ? { scale: 0.95 } : {}}
                  onClick={() => !isAnswered && setSelectedOption(option)}
                >
                  {option}
                </motion.div>
              );
            })}
          </div>

          {/* Submit / Next Button */}
          <div className="flex justify-center mt-6">
            <motion.button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                isAnswered
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnswered ? "Next Question" : "Submit Answer"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MCQModal;
