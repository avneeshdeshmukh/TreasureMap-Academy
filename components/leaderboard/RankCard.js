export default function RankCard({ user, level, rank }) {
    console.log("RankCard user data:", user);

    return (
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-5 rounded-2xl shadow-xl max-w-lg mx-auto flex items-center justify-center h-32 border-2 border-yellow-400 relative">
            {/* Rank Badge */}
            <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full shadow-md">
                #{rank}
            </div>

            <div className="flex items-center w-full">
                {/* Avatar */}
                <img
                    src="/images/solo3.png"
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md"
                />
                <div className="ml-5 w-full">
                    {/* Username */}
                    <h2 className="text-2xl font-bold text-yellow-300">{user.username}</h2>
                    
                    {/* Level with Glow Effect */}
                    <p className="text-lg font-bold text-yellow-400 glow">
                        {level}
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="ml-auto text-right">
                <p className="text-gray-300">Coins Earned: <span className="font-bold text-yellow-400">{user.leaderboardCoins}</span></p>
                <p className="text-gray-300">Streak: <span className="font-bold text-yellow-400">{user.streak}🔥</span></p>
            </div>

        </div>
    );
}
