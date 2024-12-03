const ProgressBar = ({ currentValue, maxValue, label, icon }) => {
  const progress = (currentValue / maxValue) * 100;

  return (
    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
      {/* Icon */}
      <div className="flex-shrink-0">
        {icon}
      </div>

      {/* Label and Progress */}
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-xs sm:text-sm lg:text-xs font-medium text-white">
            {label}
          </span>
          <span className="text-xs sm:text-sm lg:text-xs font-medium text-white">
            {`${currentValue} / ${maxValue}`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 sm:h-3">
          <div
            className="bg-yellow-400 h-1 sm:h-3 rounded-full text-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
