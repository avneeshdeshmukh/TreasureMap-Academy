export default function Leaderboard({users}) {

    // const sortedUsers = users
    //     .map(user => {
    //         const totalScore =
    //             (user.PLUH?.DS?.value || 0) +
    //             (user.PLUH?.ES?.value || 0) +
    //             (user.PLUH?.QPS?.value || 0) +
    //             (user.PLUH?.RPS?.currentValue || 0);
    //         return { ...user, totalScore };
    //     })
    //     .sort((a, b) => b.totalScore - a.totalScore);

        const leaderboardData = users.map((user, index) => ({
            rank: index + 1, // Index starts at 0, so add 1
            name: user.username,
            coins: user.leaderboardCoins || 0, // Adjust based on your data
            streak: user.streak || 0, // Adjust based on your data
        }));

    return (
        <div className="flex justify-center">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-8 max-w-3xl w-full">
                <h3 className="text-2xl font-semibold mb-4 text-center">Leaderboard</h3>

                {/* Section for Top 5 */}
                {/* <h4 className="text-xl font-semibold mb-2">Promotion Zone</h4> */}
                <div className="grid grid-cols-4 gap-4 text-center border-b border-gray-600 pb-2">
                    <p className="font-semibold">Rank</p>
                    <p className="font-semibold">Player</p>
                    <p className="font-semibold">Coins</p>
                    <p className="font-semibold">Streak</p>
                </div>

                {leaderboardData.map((player) => (
                <div
                    key={player.rank} // Using rank (index + 1) as key
                    className="grid grid-cols-4 gap-4 mt-2 text-center hover:bg-gray-700 transition-colors duration-200"
                >
                    <p>{player.rank}</p>
                    <div className="flex items-center justify-center">
                        
                        <p>{player.name}</p>
                    </div>
                    <p>{player.coins}</p>
                    <p>{player.streak}</p>
                </div>
            ))}

                {/* Divider for Top 5 and Top 10 */}
                <div className="border-t border-b-4 border-dashed border-gray-600 my-6"></div>

                {/* Section for Top 10 */}
                {/* <h4 className="text-xl font-semibold mb-2"></h4> */}
                {/* <div className="grid grid-cols-4 gap-4 text-center border-b border-gray-600 pb-2">
                    <p className="font-semibold">Rank</p>
                    <p className="font-semibold">Player</p>
                    <p className="font-semibold">Coins</p>
                    <p className="font-semibold">Streak</p>
                </div> */}

               

            </div>
        </div>
    );
}
