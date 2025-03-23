"use client"
import { Button } from "@/components/ui/button"
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore"

export default function secretURLPage() {
    const firestore = getFirestore();

    function splitUsers(users) {
        if (!users || users.length === 0) return [];

        users.forEach(user => {
            user.PLUH.total = user.PLUH.DS.value + user.PLUH.ES.value + user.PLUH.QPS.value + user.PLUH.RPS?.currentValue
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
            where("nextLeaderBoardType", "==", level), // Ensures courseProgress exists
        );

        const querySnapshot = await getDocs(usersQuery);
        const filteredUsers = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => Object.keys(user.courseProgress || {}).length > 0);

        // console.log(filteredUsers.length);
        console.log(splitUsers(filteredUsers))
    }

    return (
        <Button
            variant={"sidebarOutline"}
            onClick={() => getLeaderBoards("seafarer")}
        >
            Make Leaderboard
        </Button>
    )
}