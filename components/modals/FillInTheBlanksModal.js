"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const FillInTheBlanksModal = ({ questionData, onSubmit, onClose }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(() => {
    if (userAnswer.trim().toLowerCase() !== questionData.correctAnswer.toLowerCase()) {
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Stop shaking after animation
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit(userAnswer);
        onClose(); // Auto-close modal after success
      }, 2000); // Close modal after 2 seconds
    }
  }, [userAnswer, questionData, onSubmit, onClose]);

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
            {questionData.question.replace("____", "____")}
          </p>

          {/* Input Field */}
          <motion.input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className={`w-full border rounded-lg px-4 py-3 text-lg text-center bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${
              shake ? "border-red-500" : "border-gray-300"
            }`}
            animate={{ x: shake ? [-5, 5, -5, 5, 0] : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <motion.button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Answer
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Error Message Modal */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
              <p className="mb-4 text-red-600 font-semibold text-lg">
                ❌ Incorrect! Try again.
              </p>
              <Button
                variant="danger"
                onClick={() => setShowError(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
              <p className="mb-4 text-green-600 font-semibold text-lg">
                ✅ Correct Answer! Well done! 🎉
              </p>
              <motion.img
                src="/images/success.png"
                alt="Success"
                className="w-16 h-16 mx-auto mb-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FillInTheBlanksModal;
