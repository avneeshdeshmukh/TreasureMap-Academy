import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor, CircleDollarSign, Flame } from "lucide-react"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { auth } from "@/lib/firebase"
import { useState, useEffect } from "react"
import { useCoins } from "@/app/context/CoinsContext";
import { useStreak } from "@/app/context/StreakContext"

export const StreakIcons = () => {
    const { coins, setCoins } = useCoins();
    const { streak, setStreak } = useStreak();
    const firestore = getFirestore();
    const uid = auth.currentUser.uid;
    const userProgressRef = doc(firestore, "userProgress", uid);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserProgress = async () => {
            const userSnap = await getDoc(userProgressRef);
            if (userSnap.exists()) {
                console.log(userSnap.data());
                setUserData(userSnap.data());
                setCoins(userSnap.data().coins);
                setStreak(userSnap.data().streak);
            }
        }

        getUserProgress();
    }, [])

    if (userData) {



        return (
            <div className="flex items-center justify-between gap-x-1 w-full">
                <Link href={'/courses'}>
                    <Button variant="ghost" >
                        <Flame className=" mr-2" size={30} stroke="orange" fill={"orange"} />
                        <p className="text-bold text-xl">{streak}</p>
                    </Button>

                </Link>
                <Link href={"/courses"}>
                    <Button variant="ghost" >
                        <CircleDollarSign className="mr-2" size={30} fill={"none"} />
                        <p className="text-bold text-xl">{coins}</p>
                    </Button>
                </Link>
                <Link href={"/leaderboard"}>
                    <Button variant="ghost" >
                        <Anchor size={30} fill={"none"} />
                    </Button>
                </Link>

            </div>
        )
    }
}