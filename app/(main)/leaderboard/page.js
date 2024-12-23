"use client";
import RankCard from "@/components/leaderboard/RankCard"; // Fixed import for RankCard
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function Home() {
    return (
        <div>

            <div className="flex flex-col flex-1 p-3 mb-auto ml-64">
                {/* Added flex-col to stack components vertically */}
                <RankCard />
                <Leaderboard />
            </div>
        </div>

    );
}
