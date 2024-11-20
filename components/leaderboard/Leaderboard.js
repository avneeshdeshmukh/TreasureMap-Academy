export default function Leaderboard() {
    const playersTop5 = [
        { rank: 1, name: "Player1", coins: 500, streak: "20", avatar: "/images/solo4.png" },
        { rank: 2, name: "Player2", coins: 450, streak: "20", avatar: "/images/solo2.png" },
        { rank: 3, name: "Player3", coins: 400, streak: "20", avatar: "/images/solo3.png" },
        { rank: 4, name: "Player4", coins: 350, streak: "20", avatar: "/images/solo4.png" },
        { rank: 5, name: "Player5", coins: 300, streak: "10", avatar: "/images/solo1.png" },
    ];

    const playersTop10 = [
        { rank: 6, name: "Player6", coins: 250, streak: "10", avatar: "/images/solo1.png" },
        { rank: 7, name: "Player7", coins: 200, streak: "20", avatar: "/images/solo3.png" },
        { rank: 8, name: "Player8", coins: 150, streak: "20", avatar: "/images/solo2.png" },
        { rank: 9, name: "Player9", coins: 100, streak: "20", avatar: "/images/solo4.png" },
        { rank: 10, name: "Player10", coins: 50, streak: "20", avatar: "/images/solo1.png" },
    ];

    return (
        <div className="flex justify-center">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-8 max-w-3xl w-full">
                <h3 className="text-2xl font-semibold mb-4 text-center">Leaderboard</h3>

                {/* Section for Top 5 */}
                <h4 className="text-xl font-semibold mb-2">Promotion Zone</h4>
                <div className="grid grid-cols-4 gap-4 text-center border-b border-gray-600 pb-2">
                    <p className="font-semibold">Rank</p>
                    <p className="font-semibold">Player</p>
                    <p className="font-semibold">Coins</p>
                    <p className="font-semibold">Streak</p>
                </div>

                {playersTop5.map((player) => (
                    <div key={player.rank} className="grid grid-cols-4 gap-4 mt-2 text-center hover:bg-gray-700 transition-colors duration-200">
                        <p>{player.rank}</p>
                        <div className="flex items-center justify-center">
                            <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full mr-2" />
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

                {playersTop10.map((player) => (
                    <div key={player.rank} className="grid grid-cols-4 gap-4 mt-2 text-center hover:bg-gray-700 transition-colors duration-200">
                        <p>{player.rank}</p>
                        <div className="flex items-center justify-center">
                            <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full mr-2" />
                            <p>{player.name}</p>
                        </div>
                        <p>{player.coins}</p>
                        <p>{player.streak}</p>
                    </div>
                ))}

                {/* Additional Sections can go here */}
                <div className="border-t border-b-4 border-dashed border-gray-600 my-6"></div>

                {/* Example for more sections */}
                <h4 className="text-xl font-semibold mb-2">Relegation Zone</h4>
                <div className="grid grid-cols-4 gap-4 text-center border-b border-gray-600 pb-2">
                    <p className="font-semibold">Rank</p>
                    <p className="font-semibold">Player</p>
                    <p className="font-semibold">Coins</p>
                    <p className="font-semibold">Streak</p>
                </div>

                {/* Sample data for Adventurers */}
                <div className="grid grid-cols-4 gap-4 mt-2 text-center hover:bg-gray-700 transition-colors duration-200">
                    <p>1</p>
                    <div className="flex items-center justify-center">
                        <img src="/images/solo4.png" alt="Adventurer 1" className="w-8 h-8 rounded-full mr-2" />
                        <p>Player11</p>
                    </div>
                    <p>600</p>
                    <p>25</p>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-2 text-center hover:bg-gray-700 transition-colors duration-200">
                    <p>2</p>
                    <div className="flex items-center justify-center">
                        <img src="/images/solo2.png" alt="Adventurer 2" className="w-8 h-8 rounded-full mr-2" />
                        <p>Player12</p>
                    </div>
                    <p>550</p>
                    <p>25</p>
                </div>
            </div>
        </div>
    );
}
