export default function Leaderboard({users, user}) {

        const leaderboardData = users.map((user, index) => ({
            rank: index + 1, // Index starts at 0, so add 1
            name: user.username,
            coins: user.leaderboardCoins || 0, // Adjust based on your data
            streak: user.streak || 0, // Adjust based on your data
        }));

        const isUser = user.username;
        console.log(isUser);
    return (
<div className="flex justify-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 rounded-2xl shadow-2xl mt-8 w-full max-w-3xl border-2 border-gray-700">
                {/* Section for Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center border-b-2 border-gray-600 pb-3">
                    <p className="font-bold text-sm sm:text-lg text-gray-300 uppercase tracking-wider">Rank</p>
                    <p className="font-bold text-sm sm:text-lg text-gray-300 uppercase tracking-wider">Player</p>
                    <p className="font-bold text-sm sm:text-lg text-gray-300 uppercase tracking-wider hidden sm:block">Coins</p>
                    <p className="font-bold text-sm sm:text-lg text-gray-300 uppercase tracking-wider hidden sm:block">Streak</p>
                </div>

                {leaderboardData.map((player) => (
                    <div
                        key={player.rank}
                        className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2 text-center hover:bg-gray-700 transition-colors duration-200 py-2 sm:py-3 rounded-lg group ${
                            player.name === isUser
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-500/40 shadow-lg shadow-blue-500/50'
                                : ''
                        }`}
                    >
                        <p className="flex items-center justify-center font-semibold text-gray-400 group-hover:text-white text-sm sm:text-base">
                            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600">
                                {player.rank}
                            </span>
                        </p>
                        <div className="flex items-center justify-center">
                            <p className="font-medium group-hover:text-gray-200 text-sm sm:text-base truncate">{player.name}</p>
                        </div>
                        <p className="flex items-center justify-center font-semibold text-yellow-400 group-hover:text-yellow-300 text-sm sm:text-base sm:flex">
                            {player.coins}
                            <span className="ml-1 text-xs opacity-70">💰</span>
                        </p>
                        <p className="flex items-center justify-center font-semibold text-green-400 group-hover:text-green-300 text-sm sm:text-base sm:flex">
                            {player.streak}
                            <span className="ml-1 text-xs opacity-70">🔥</span>
                        </p>
                        {/* Mobile-only stats */}
                        <div className="sm:hidden col-span-2 text-xs text-gray-300 flex justify-between px-2">
                            <span>Coins: {player.coins} 💰</span>
                            <span>Streak: {player.streak} 🔥</span>
                        </div>
                    </div>
                ))}

                {/* Divider for Top 5 and Top 10 */}
                <div className="border-t-2 border-b-4 border-dashed border-gray-600 my-4 sm:my-6 opacity-50"></div>
            </div>
        </div>
    );
}
