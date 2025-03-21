
export const ProgressBar = ({ currentValue, maxValue, label, icon, disabled }) => {
    const progress = (currentValue / maxValue) * 100;

    return (
        <div className="flex items-center space-x-4 mb-6">
            {/* Icon */}
            <div className="flex-shrink-0">
                {icon}
            </div>

            {/* Label and Progress */}
            <div className="w-full">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{label}</span>
                    <span className="text-sm font-medium text-white">{maxValue ? `${currentValue}/${maxValue}` : currentValue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={disabled ? "bg-gray-400 w-full h-3 rounded-full" : "bg-yellow-400 h-3 rounded-full"}
                        style={!disabled ? { width: `${progress}%` } : {}}
                    ></div>
                </div>

            </div>
        </div>
    );
};

