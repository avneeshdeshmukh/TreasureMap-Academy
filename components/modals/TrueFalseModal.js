"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TrueFalseModal = ({ questionData, onSubmit, currentPoints, setCoins, time, factor }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!isAnswered && selectedOption !== null) {
      console.log(factor);
      console.log(time);
      if (selectedOption.toLowerCase() === questionData.correctAnswer.toLowerCase()) {
        const newPoints = currentPoints + questionData.points * factor[time];
        console.log(`TF points : ${newPoints}`);
        setCoins(newPoints);
      }
      setIsAnswered(true);
    } else if (isAnswered) {
      onSubmit();
    }
  }, [isAnswered, selectedOption, questionData.correctAnswer, questionData.points, currentPoints, setCoins, onSubmit]);

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
            ☠️ True or False ☠️
          </h2>

          {/* Pirate Image */}
          <motion.img
            src="/images/solo3.png"
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

          {/* True / False Buttons */}
          <div className="flex justify-center gap-6">
            {["True", "False"].map((option) => {
              let bgColor = "bg-gray-200 text-gray-700"; // Default
              if (isAnswered) {
                if (option.toLowerCase() === questionData.correctAnswer.toLowerCase()) {
                  bgColor = "bg-green-400 border-green-600 text-white";
                } else if (option.toLowerCase() === selectedOption) {
                  bgColor = "bg-red-400 border-red-600 text-white";
                }
              } else if (selectedOption === option.toLowerCase()) {
                bgColor = "bg-yellow-500 text-black";
              }

              return (
                <motion.button
                  key={option}
                  className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all shadow-md ${bgColor} ${isAnswered ? "pointer-events-none" : "hover:bg-yellow-400"
                    }`}
                  whileTap={!isAnswered ? { scale: 0.95 } : {}}
                  onClick={() => !isAnswered && setSelectedOption(option.toLowerCase())}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Submit / Next Button */}
          <div className="flex justify-center gap-4 mt-6">
            <motion.button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed ${isAnswered
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

export default TrueFalseModal;
