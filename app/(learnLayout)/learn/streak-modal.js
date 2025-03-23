import React, { useState } from 'react';

// Streak Goal Modal Component
const StreakGoalModal = ({ isOpen, onClose, onSave }) => {
  const [goal, setGoal] = useState(20);
  const dayOptions = [20, 40, 60, 80, 100];
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    onSave(goal);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#f8e8c8] border border-yellow-700 shadow-lg rounded-xl w-full max-w-md p-4 sm:p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-yellow-900">
            Set Your Streak Goal
          </h2>
          <button 
            onClick={onClose}
            className="text-yellow-900 hover:text-yellow-700 focus:outline-none"
          >
            
          </button>
        </div>
        
        <p className="text-gray-800 text-sm md:text-base mb-4">
          Choose a streak goal to keep yourself motivated.
        </p>
        
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-2">
            {dayOptions.map(days => (
              <button
                key={days}
                onClick={() => setGoal(days)}
                className={`py-2 px-1 rounded-lg transition-all duration-200 text-center ${
                  goal === days 
                    ? 'bg-yellow-600 text-white font-bold shadow-md' 
                    : 'bg-[#f8e8c8] border border-yellow-700 text-yellow-900 hover:bg-yellow-100'
                }`}
              >
                <span className="block text-lg font-semibold">{days}</span>
                <span className="block text-xs">days</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-3 justify-end">
          <button 
            onClick={onClose}
            className="border border-yellow-700 text-yellow-900 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 sm:px-6 py-2 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base"
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakGoalModal;