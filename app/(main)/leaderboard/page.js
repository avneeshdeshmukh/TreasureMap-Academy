"use client";
import RankCard from "@/components/leaderboard/RankCard"; // Fixed import for RankCard
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function LeaderboardPage() {
    return (
            <div className="flex-col justify-center items-center px-5 py-5 lg:px-0">
                {/* Added flex-col to stack components vertically */}
                <RankCard />
                <Leaderboard />
            </div>
    );
}
