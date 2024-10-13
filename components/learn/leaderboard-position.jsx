import { Button } from "@/components/ui/button";
import { Anchor } from "lucide-react"

const LeaderboardPos = () => {
    return (
        <div
            className="text-white rounded-xl my-2 fixed top-[130px] right-3 w-1/5 z-50 border-4 border-[#606060] text-lg bg-[#2c3748] justify-center p-5 shadow-lg"
        >
            <h2 className="font-bold text-2xl ms-3 mb-2">Sailor</h2>
            <hr />
            <div className="flex mt-3 mb-2">
                <div className="w-1/3 flex justify-center items-center me-3 border-yellow-400 border-2 rounded-xl">
                <Anchor stroke={"#daa520"} size={40}/>
                </div>
                <div className="div w-2/3">
                     <p className="text-sm font-bold mb-2">You’re 18th Sailor</p>
                     <p className="text-sm">You've earned 183 Coins this week so far</p>
                </div>
            </div>
            <div className="flex justify-end mt-5">
                <Button
                    variant='ghost'
                >View Leaderboard
                </Button>
            </div>
        </div>
    );
}

export default LeaderboardPos;