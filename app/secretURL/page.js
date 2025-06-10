"use client"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, query, getDocs, where, setDoc, updateDoc, doc, getDoc } from "firebase/firestore"

export default function secretURLPage() {
    const firestore = getFirestore();

    function splitUsers(users) {
        if (!users || users.length === 0) return [];

        users.forEach(user => {
            user.PLUH.total =
                (user.PLUH.DS?.value || 0) +
                (user.PLUH.ES?.value || 0) +
                (user.PLUH.QPS?.value || 0) +
                (user.PLUH.RPS?.currentValue || 0);
        });

        // 1. Sort users in descending order of score
        users.sort((a, b) => b.PLUH.total - a.PLUH.total);

        // 2. Split users into groups of 10
        let groups = [];
        for (let i = 0; i < users.length; i += 10) {
            groups.push(users.slice(i, i + 10));
        }

        // 3. Handle cases where the last group has less than 10 users
        if (groups.length > 1 && groups[groups.length - 1].length < 10) {
            let lastGroup = groups.pop();
            groups[groups.length - 1] = groups[groups.length - 1].concat(lastGroup);
        }

        return groups;
    }


    const getLeaderBoards = async (level) => {
        const usersRef = collection(firestore, "userProgress");
        const usersQuery = query(
            usersRef,
        );

        const querySnapshot = await getDocs(usersQuery);

        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(users);

        // For each user, get the level of their current leaderboard
        const filteredUsers = [];

        for (const user of users) {
            const leaderboardId = user.currentLeaderboard;
            if (!leaderboardId) continue;

            const leaderboardDocRef = doc(firestore, "leaderboard", leaderboardId);
            const leaderboardDoc = await getDoc(leaderboardDocRef);

            if (leaderboardDoc.exists()) {
                const leaderboardData = leaderboardDoc.data();
                if (leaderboardData.level != level) {
                    filteredUsers.push(user);
                }
            }
        }

        console.log(filteredUsers);




        // console.log(filteredUsers.length);
        // console.log(splitUsers(filteredUsers))

        // const groups = splitUsers(filteredUsers);

        // for (const group of groups) {

        //     let users = [];
        //     group.forEach(user => {
        //         users.push(user.username);
        //     })
        //     const leaderboardId = uuidv4();
        //     const leaderboardEntry = {
        //         id: leaderboardId, // Generate unique ID
        //         level: level, // Store the level for reference
        //         users: users, // Add the users in this group
        //         createdAt: new Date(), // Timestamp
        //     };

        //     for (const user of group) {
        //         try {
        //             console.log(user);
        //             const userDocRef = doc(firestore, "userProgress", user.uid);
        //             await updateDoc(userDocRef, { currentLeaderboard: leaderboardId });
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     }
        //     const leaderboardDocRef = doc(firestore, "leaderboard", leaderboardId);
        //     await setDoc(leaderboardDocRef, leaderboardEntry);
        // }
    }

    return (
        <Button
            variant={"sidebarOutline"}
            onClick={() => getLeaderBoards("captain")}
        >
            Make Leaderboard
        </Button>
    )
}