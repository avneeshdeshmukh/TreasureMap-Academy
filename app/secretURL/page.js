"use client"
import { Button } from "@/components/ui/button"

export default function secretURLPage(){

    const handleClick = ()=>{
        alert("Leaderboard");
    }

    return (
        <Button
        variant = {"sidebarOutline"}
        onClick = {handleClick}
        >
            Make Leaderboard
        </Button>
    )
}