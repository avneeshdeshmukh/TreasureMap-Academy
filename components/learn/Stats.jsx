import ProgressBar from "../ProgressBar";
import { Button } from "@/components/ui/button";

const Stats = () => {
    return (
        <div
            className="text-white rounded-xl my-2 fixed top-96 right-3 h-1/2 w-1/5 z-50 border-4 border-[#606060] text-lg bg-[#2c3748] justify-center p-5 shadow-lg"
        >
            <h2 className="font-bold text-2xl ms-3 mb-2">Stats</h2>
            <hr />
            <br />
            <ProgressBar
                currentValue={2}
                maxValue={14}
                label="Lessons Completed"
            />
            <ProgressBar
                currentValue={40}
                maxValue={300}
                label="Coins Earned"
            />
            <ProgressBar
                currentValue={14}
                maxValue={70}
                label="Quizzes Completed"
            />
            <ProgressBar
                currentValue={45}
                maxValue={50}
                label="Streak Goal"
            />
            <div className="flex justify-end">
                <Button
                    variant='ghost'
                >More Stats
                </Button>
            </div>

        </div>
    );
};

export default Stats;