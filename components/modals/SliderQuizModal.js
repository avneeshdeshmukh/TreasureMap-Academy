"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

const SliderQuizModal = ({ questionData, onSubmit, onClose }) => {
  const [selectedValue, setSelectedValue] = useState(50);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (selectedValue === questionData.correctAnswer) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit(true);
        onClose();
      }, 2000); // Close modal after 2 seconds
    } else {
      setShowError(true);
    }
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

          <div className="w-full flex justify-center mt-4">
            <motion.button
              onClick={handleSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Answer
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Error Popup */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]"
          >
            <div className="bg-white p-6 rounded shadow-md w-96 text-center">
              <p className="mb-4 text-red-600 font-semibold text-lg">
                ❌ Incorrect answer, try again.
              </p>
              <Button variant="danger" onClick={() => setShowError(false)}>
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
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

export default SliderQuizModal;
