"use client"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, query, getDocs, where, setDoc, updateDoc, doc, getDoc } from "firebase/firestore"

export default function secretURLPage() {
    const firestore = getFirestore();


    const chunkUsers = (users) => {
        const chunkSize = 10;
        const chunks = [];

        // Create chunks of 10
        for (let i = 0; i < users.length; i += chunkSize) {
            chunks.push(users.slice(i, i + chunkSize));
        }

        // Handle remaining users if any
        if (chunks.length > 0 && chunks[chunks.length - 1].length < 10) {
            const lastChunk = chunks[chunks.length - 1];
            const remainingCount = lastChunk.length;

            if (remainingCount < 5 && chunks.length > 1) {
                // If less than 5, merge with previous chunk
                const lastUsers = chunks.pop();
                chunks[chunks.length - 1].push(...lastUsers);
            }
            // If 5 or more, keep as separate chunk (already handled by slice)
        }

        // Categorize chunks into tiers
        const totalChunks = chunks.length;
        const baseThird = Math.floor(totalChunks / 3); // Base number of chunks per tier
        const remainder = totalChunks % 3; // Extra chunks to distribute

        // Assign chunks: captain and seafarer get baseThird, sailor gets baseThird + remainder
        const captainCount = baseThird;
        const seafarerCount = baseThird;
        const sailorCount = baseThird + remainder;

        const tieredChunks = {
            captain: chunks.slice(0, captainCount),
            sailor: chunks.slice(captainCount, captainCount + sailorCount),
            seafarer: chunks.slice(captainCount + sailorCount, totalChunks)
        };

        return tieredChunks;
    };



    const getLeaderBoards = async () => {
        const usersRef = collection(firestore, "userProgress");
        const usersQuery = query(
            usersRef,
        );

        const querySnapshot = await getDocs(usersQuery);

        const users = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));

        users.forEach(user => {
            user.PLUH.total =
                (user.PLUH.DS?.value || 0) +
                (user.PLUH.ES?.value || 0) +
                (user.PLUH.QPS?.value || 0) +
                (user.PLUH.RPS?.currentValue || 0);
        });

        // 1. Sort users in descending order of score
        users.sort((a, b) => b.PLUH.total - a.PLUH.total);

        const userChunks = chunkUsers(users);
        console.log(userChunks);

        for (let chunk of userChunks.captain) {
            const leaderboardId = uuidv4();
            const leaderboardEntry = {
                id: leaderboardId, // Generate unique ID
                level: "captain", // Store the level for reference
                users: chunk, // Add the users in this group
                createdAt: new Date(), // Timestamp
            };

            for (let user of chunk) {
                try {
                    const userDocRef = doc(firestore, "userProgress", user.uid);
                    await updateDoc(userDocRef,
                        {
                            currentLeaderboard: leaderboardId,
                            currentLeaderboardLevel: "captain",
                        }
                    );
                } catch (err) {
                    console.log(err);
                }
            }

            const leaderboardDocRef = doc(firestore, "leaderboard", leaderboardId);
            await setDoc(leaderboardDocRef, leaderboardEntry);
        }

        for (let chunk of userChunks.sailor) {
            const leaderboardId = uuidv4();
            const leaderboardEntry = {
                id: leaderboardId, // Generate unique ID
                level: "sailor", // Store the level for reference
                users: chunk, // Add the users in this group
                createdAt: new Date(), // Timestamp
            };

            for (let user of chunk) {
                try {
                    const userDocRef = doc(firestore, "userProgress", user.uid);
                    await updateDoc(userDocRef,
                        {
                            currentLeaderboard: leaderboardId,
                            currentLeaderboardLevel: "sailor",
                        }
                    );
                } catch (err) {
                    console.log(err);
                }
            }

            const leaderboardDocRef = doc(firestore, "leaderboard", leaderboardId);
            await setDoc(leaderboardDocRef, leaderboardEntry);
        }

        for (let chunk of userChunks.seafarer) {
            const leaderboardId = uuidv4();
            const leaderboardEntry = {
                id: leaderboardId, // Generate unique ID
                level: "seafarer", // Store the level for reference
                users: chunk, // Add the users in this group
                createdAt: new Date(), // Timestamp
            };

            for (let user of chunk) {
                try {
                    const userDocRef = doc(firestore, "userProgress", user.uid);
                    await updateDoc(userDocRef,
                        {
                            currentLeaderboard: leaderboardId,
                            currentLeaderboardLevel: "seafarer",
                        }
                    );
                } catch (err) {
                    console.log(err);
                }
            }

            const leaderboardDocRef = doc(firestore, "leaderboard", leaderboardId);
            await setDoc(leaderboardDocRef, leaderboardEntry);
        }

    }

    return (
        <Button
            variant={"sidebarOutline"}
            onClick={() => getLeaderBoards()}
        >
            Make Leaderboard
        </Button>
    )
}