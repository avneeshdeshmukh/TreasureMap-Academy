import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor, CircleDollarSign, Flame } from "lucide-react"

export const StreakIcons = ({ streak, coins }) => {
    return (
        <div className="flex items-center justify-between gap-x-1 w-full">
            <Link href={'/courses'}>
                <Button variant="ghost" >
                    <Flame className="animate-pulse mr-2" size={30} stroke="orange" fill={"orange"} />
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