import { Button } from "@/components/ui/button";
import { Anchor } from "lucide-react";

const LeaderboardPos = () => {
  return (
    <div className="text-white rounded-xl -my-2 fixed top-32 right-2 h-44 md:w-1/3 lg:w-64 z-50 border-4 border-[#606060] text-md bg-[#2c3748] p-4 shadow-lg">
      <h2 className="font-bold text-sm md:text-2xl lg:text-xl mb-1">Sailor</h2>
      <hr />
      <div className="flex mt-3 mb-2">
        <div className="md:w-1/4 lg:w-14 h-10 lg:h-10 flex justify-center items-center me-3 border-yellow-400 border-2 rounded-xl">
          <Anchor stroke={"#daa520"} size={28} />
        </div>
        <div className="w-3/4 -mb-12 mr-4">
          <p className="text-xs md:text-base lg:text-sm font-bold mb-2">
            You’re 18th Sailor
          </p>
          <p className="text-xs md:text-sm lg:text-xs -my-2">
            You've earned 183 Coins this week so far
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-7 w-5 ml-44">
        <Button variant="ghost" className="text-xs sm:text-sm md:text-base lg:text-xs rounded-md xl:text-xs h-4">
          View Leaderboard
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardPos;
