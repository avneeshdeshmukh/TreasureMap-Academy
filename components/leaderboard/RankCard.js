export default function RankCard({user, level, rank}) {

    console.log("RankCard user data:", user)
    return (
        <div className="bg-gray-800  text-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto flex items-center justify-center h-28">
            <div className="flex items-center w-full">
                <img
                    src="/images/solo3.png" // Replace with the actual avatar image
                    alt="Avatar"
                    className="w-16 h-16 rounded-full"
                />
                <div className="ml-6 w-full">
                    <h2 className="text-2xl font-semibold">{user.username}</h2>
                    <p className="text-yellow-400">Rank #{rank}</p>
                    <p className="font-bold text-yellow-400 text-xl">{level}</p> {/* Rank Name */}
                </div>
            </div>
            <div className="ml-auto">
                <p>Coins Earned: <span className="font-bold">{user.leaderboardCoins}</span></p>
                <p>Streak: <span className="font-bold">{user.streak}</span></p>
            </div>
        </div>
    );
}
