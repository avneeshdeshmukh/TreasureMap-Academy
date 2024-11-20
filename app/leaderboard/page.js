"use client";
import Sidebar from "@/components/learn/Sidebar";
import RankCard from "@/components/leaderboard/RankCard"; // Fixed import for RankCard
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function Home() {
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#f5f5dc" }}>
            <Sidebar />
            <div className="flex flex-col flex-1 p-3 mb-auto ml-64"> 
                {/* Added flex-col to stack components vertically */}
                <RankCard />
                <Leaderboard /> 
            </div>
        </div>
    );
}
