import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Anchor, CompassIcon } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";

const LeaderboardPos = ({ position, level, coins }) => {

    const displayPosition = (position) =>{
        switch (position) {
            case 1:
                return "1st"
            
            case 2 :
                return "2nd"
            
            case 3 :
                return "3rd"
        
            default:
                return `${position}th`
        }
    }

    if (position === null || level === null) {
        return (<></>)
    }
    return (
        <div
            className="text-white rounded-xl my-2  z-50 border-4 border-[#606060] text-lg bg-[#2c3748] justify-center p-5 shadow-lg"
        >
            <h2 className="font-bold text-2xl ms-3 mb-2">{level}</h2>
            <hr />
            <div className="flex mt-3 mb-2">
                <div className="w-1/3 flex justify-center items-center me-3 border-yellow-400 border-2 rounded-xl">
                    <CompassIcon stroke={"#daa520"} size={40} />
                </div>
                <div className="div w-2/3">
                    <p className="text-sm font-bold mb-2">You’re {displayPosition(position)} {`${level[0].toUpperCase()}${level.substring(1)}`}</p>
                    <p className="text-sm">You&apos;ve earned {coins} Coins this week so far</p>
                </div>
            </div>
            <div className="flex justify-end mt-5">
                <Link href="/leaderboard">
                    <Button
                        variant='ghost'
                    >View Leaderboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default LeaderboardPos;