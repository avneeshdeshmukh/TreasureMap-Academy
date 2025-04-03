import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CelebrationParticles = () => {
  return (
    <>
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-3 h-3 rounded-full"
          initial={{
            x: 0,
            y: 0,
            backgroundColor:
              index % 3 === 0 ? "#EAB308" : index % 3 === 1 ? "#2563EB" : "#10B981",
          }}
          animate={{
            x: Math.sin(index) * 80,
            y: Math.cos(index) * 80,
            opacity: [1, 0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: 1,
            repeatType: "reverse",
            delay: index * 0.08,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

const BadgeUnlockedPreview = ({ badge, onClose }) => {
  return (
    <AnimatePresence>
      {badge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
          >
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>

            <div className="text-center">
              <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 10, duration: 0.5 }} className="mb-4">
                <h2 className="text-2xl font-bold text-yellow-600 mb-1">Badge Unlocked!</h2>
                <div className="h-0.5 w-24 bg-yellow-400 mx-auto mb-4"></div>
              </motion.div>

              <div className="flex justify-center mb-6 relative">
                <motion.div
                  className="relative z-10"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 5 }}
                  transition={{ duration: 0.5, repeat: 6, repeatType: "reverse", ease: "easeInOut" }}
                >
                  <img src={badge.imagePath} alt={badge.name} className="w-32 h-32 object-cover rounded-lg shadow-lg border-4 border-yellow-400" />
                </motion.div>

                <CelebrationParticles />
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{badge.name}</h3>
                <p className="text-gray-600 text-sm">{badge.condition}</p>
              </div>

              <button onClick={onClose} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-full transition-colors font-medium">
                Continue Adventure
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BadgeUnlockedPreview;