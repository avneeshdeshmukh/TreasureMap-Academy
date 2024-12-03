import ProgressBar from "../ProgressBar";
import { Button } from "@/components/ui/button";

const Stats = () => {
    return (
        <div className="text-white rounded-xl top-80 fixed right-2 w-11/12 md:w-1/3 lg:w-1/5 z-50 border-4 border-[#606060] text-lg bg-[#2c3748] p-4 shadow-lg">
    <h2 className="font-bold text-sm md:text-2xl lg:text-xl mb-1">Stats</h2>
    <hr />
    <div className="mt-3 space-y-4">
        <ProgressBar currentValue={2} maxValue={14} label="Lessons Completed" />
        <ProgressBar currentValue={40} maxValue={300} label="Coins Earned" />
        <ProgressBar currentValue={14} maxValue={70} label="Quizzes Completed" />
        <ProgressBar currentValue={45} maxValue={50} label="Streak Goal" />
    </div>
    <div className="flex justify-center items-center mt-1">
        <Button variant="ghost" className="text-xs sm:text-sm md:text-base lg:text-xs rounded-md xl:text-xs h-4 mt-1">More Stats</Button>
    </div>
</div>
    );
};

export default Stats;