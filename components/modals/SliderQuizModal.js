"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const SliderQuizModal = ({ questionData, onSubmit, currentPoints, setCoins, time, factor, preview }) => {
  const [selectedValue, setSelectedValue] = useState(50);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // Null = no answer yet

  const handleSubmit = () => {
    const isAnswerCorrect = selectedValue === questionData.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);

    if (isAnswerCorrect === true && !preview) {
      const newPoints = currentPoints + questionData.points * factor[time];
      console.log(`Slider points : ${newPoints}`);
      setCoins(newPoints);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setIsCorrect(null);
    setSelectedValue(50); // Reset slider
    onSubmit();
  };

  const incrementValue = () => {
    setSelectedValue((prev) => (prev < 100 ? prev + 1 : prev));
  };

  const decrementValue = () => {
    setSelectedValue((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-xl w-[500px] max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Percentage Quiz
          </h2>

          <motion.img
            src="/images/solo4.png"
            alt="Pirate kid"
            className="w-28 h-28 object-contain mx-auto mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          />

          <p className="mb-6 text-center text-lg">{questionData.question}</p>

          <div className="w-full mb-6 flex flex-col items-center">
            <div className="flex justify-between w-full mb-3 text-sm font-semibold">
              <span>0%</span>
              <span className="text-xl font-bold text-yellow-600">
                {selectedValue}%
              </span>
              <span>100%</span>
            </div>
            <div className="flex items-center w-full">
              <Button variant="ghost" onClick={decrementValue} className="mr-3 px-4 py-2">
                <span className="text-4xl leading-none">−</span>
              </Button>

              <input
                type="range"
                min="0"
                max="100"
                value={selectedValue}
                onChange={(e) => setSelectedValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />

              <Button variant="ghost" onClick={incrementValue} className="ml-3 px-4 py-2">
                <span className="text-4xl leading-none">+</span>
              </Button>
            </div>
          </div>

          {/* Feedback Message */}
          {isAnswered && (
            <div className="text-center mb-4">
              <p
                className={`text-lg font-semibold ${isCorrect ? "text-green-600" : "text-red-600"
                  }`}
              >
                {isCorrect ? "✅ Correct! Well done!" : "❌ Incorrect!"}
              </p>
              {!isCorrect && (
                <p className="text-gray-700 font-medium">
                  🎯 The correct answer was <span className="text-blue-600 font-bold">{questionData.correctAnswer}%</span>
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="w-full flex justify-center mt-4">
            {!isAnswered ? (
              <motion.button
                onClick={handleSubmit}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Answer
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNextQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Question
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SliderQuizModal;
