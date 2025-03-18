"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const FillInTheBlanksModal = ({ questionData, onSubmit, currentPoints, setCoins }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // null -> not answered, true -> correct, false -> incorrect

  const handleSubmit = useCallback(() => {
    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() === questionData.correctAnswer.toLowerCase();

    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);

    if (isAnswerCorrect === true) {
      const newPoints = currentPoints + questionData.points * 10;
      console.log(`Fill points : ${newPoints}`);
      setCoins(newPoints);
    }
  }, [userAnswer, questionData]);

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
            🏴‍☠️ Fill in the Blanks 🏴‍☠️
          </h2>

          {/* Pirate Image */}
          <motion.img
            src="/images/solo2.png"
            alt="Pirate Kid"
            className="w-28 h-28 object-contain mx-auto mb-4"
            initial={{ y: -10 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* Question */}
          <p className="mb-4 text-lg text-center font-medium text-gray-700">
            {questionData.question.replace("<blank>", "____")}
          </p>

          {/* Input Field */}
          <motion.input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className={`w-full border rounded-lg px-4 py-3 text-lg text-center bg-white focus:ring-2 outline-none transition-all ${isAnswered
                ? isCorrect
                  ? "border-green-500 text-green-600 bg-green-100"
                  : "border-red-500 text-red-600 bg-red-100"
                : "border-gray-300 focus:ring-yellow-400"
              }`}
            disabled={isAnswered}
            animate={{ x: isAnswered && !isCorrect ? [-5, 5, -5, 5, 0] : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Feedback Message */}
          {isAnswered && (
            <p className={`mt-3 text-lg text-center font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "✅ Correct!" : `❌ Incorrect! The correct answer was: "${questionData.correctAnswer}"`}
            </p>
          )}

          {/* Submit / Next Button */}
          <div className="flex justify-center mt-6">
            <motion.button
              onClick={isAnswered ? onSubmit : handleSubmit}
              disabled={!userAnswer}
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

export default FillInTheBlanksModal;
