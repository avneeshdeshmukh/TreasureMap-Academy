"use client";
import RankCard from "@/components/leaderboard/RankCard"; // Fixed import for RankCard
import Leaderboard from "@/components/leaderboard/Leaderboard";
import { auth } from "@/lib/firebase";
import { doc, getDoc, getFirestore, collection, query, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function LeaderboardPage() {

    const firestore = getFirestore();
    const uid = auth.currentUser.uid;
    const userProgRef = doc(firestore, "userProgress", uid);
    const [userData, setUserData] = useState(null);
    const [userRank, setUserRank] = useState(0);
    const [level, setLevel] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [allUsersProgress, setAllUsersProgress] = useState([]);

    const fetchUserData = async () => {
        const userSnap = await getDoc(userProgRef);
        console.log(userSnap.data());
        const userData = userSnap.data();
        const keys = Object.keys(userSnap.data());
        if(!keys.includes('currentLeaderboard'))  userData.currentLeaderboard = null;
        setUserData(userSnap.data());
    }

    const fetchLeaderBoard = async () => {
        if (!userData || !userData.currentLeaderboard) return;
        if (!userData) return;
        const leadId = userData.currentLeaderboard;
        const leaderboardRef = doc(firestore, "leaderboard", leadId);

        const leadSnap = await getDoc(leaderboardRef);
        setLevel(leadSnap.data().level);
        setAllUsers(leadSnap.data().users);
    }

    const fetchAllUsersData = async () => {
        if (allUsers.length === 0) return;
        const usersRef = collection(firestore, "userProgress");
        const q = query(usersRef, where("__name__", "in", allUsers));

        try {
            const usersRef = collection(firestore, "userProgress");
            const batches = [];
            for (let i = 0; i < allUsers.length; i += 10) {
                const batchUsers = allUsers.slice(i, i + 10);
                const q = query(usersRef, where("username", "in", batchUsers));
                batches.push(getDocs(q));
            }

            const querySnapshots = await Promise.all(batches);
            const usersProgressData = querySnapshots
                .flatMap(snapshot => snapshot.docs)
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            const sortedUsers = usersProgressData
                .sort((a, b) => b.leaderboardCoins - a.leaderboardCoins);

            console.log("Fetched user progress data:", sortedUsers);
            setAllUsersProgress(sortedUsers);

            const userIndex = sortedUsers.findIndex(user => user.id === uid);
            if (userIndex !== -1) {
                setUserRank(userIndex + 1); // Convert 0-based index to 1-based rank
            }
        } catch (error) {
            console.error("Error fetching users progress:", error);
        }

    }

    useEffect(() => {
        fetchUserData();
    }, [uid])

    useEffect(() => {
        fetchLeaderBoard();
    }, [userData])


    useEffect(() => {
        fetchAllUsersData();
    }, [userData, allUsers])

    if (userData && !userData.currentLeaderboard) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-xl border-2 border-yellow-400">
                    <h1 className="text-2xl font-bold text-yellow-400 text-center">
                        You are not in a leaderboard yet
                    </h1>
                </div>
            </div>
        );
    }


    return (
        userData &&
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-10 px-5 lg:px-0">
        {/* Rank Card */}
        <div className="mb-6 w-full max-w-2xl">
            <RankCard user={userData} level={level} rank={userRank} />
        </div>

        {/* Leaderboard Section */}
        <div className="w-full max-w-3xl bg-gray-800 text-white p-6 rounded-2xl shadow-xl border-2 border-yellow-400">
            <h1 className="text-3xl font-bold text-yellow-400 text-center mb-4">
                Leaderboard 🏆
            </h1>
            <Leaderboard users={allUsersProgress} user={userData}/>
        </div>
    </div>
    );
}