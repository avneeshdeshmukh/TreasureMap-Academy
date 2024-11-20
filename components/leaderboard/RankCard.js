export default function RankCard() {
    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto flex items-center justify-center h-28">
            <div className="flex items-center w-full">
                <img
                    src="/images/solo3.png" // Replace with the actual avatar image
                    alt="Avatar"
                    className="w-16 h-16 rounded-full"
                />
                <div className="ml-6 w-full">
                    <h2 className="text-2xl font-semibold">Player Name</h2>
                    <p className="text-yellow-400">Rank #18</p>
                    <p className="font-bold text-yellow-400 text-xl">Sailor</p> {/* Rank Name */}
                </div>
            </div>
            <div className="ml-auto">
                <p>Coins Earned: <span className="font-bold">183</span></p>
                <p>Streak Goal: <span className="font-bold">45/50</span></p>
            </div>
        </div>
    );
}
