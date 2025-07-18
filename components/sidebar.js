'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import SidebarItem from "./sidebar-item"
import { usePathname } from "next/navigation"

export const Sidebar = ({ className }) => { //#2c3748
    const pathname = usePathname(); // Get the current path

    // Determine the active item based on the pathname
    const getActiveItem = () => {
        if (pathname.includes("/leaderboard")) return "Leaderboard";
        if (pathname.includes("/learn")) return "Learn";
        if (pathname.includes("/badges")) return "Badges";
        if (pathname.includes("/shop")) return "Shop";
        if (pathname.includes("/profile")) return "Profile";
        return "";
    };

    const activeItem = getActiveItem();
    return (
        <div className={cn("flex h-full lg:w-[360px] lg:fixed top-0 left-0 px-4  flex-col bg-slate-800",
            className)}> 
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold my-2.5 text-center"><Image src="/images/logo.png" width={75} height={50} /></h2>
                <div className="container text-center my-10">
                    <SidebarItem
                        variant={activeItem === "Learn" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"house"}
                        href={"/learn"}
                        label={"Learn"}
                    />
                    <SidebarItem
                        variant={activeItem === "Leaderboard" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"swords"}
                        href={"/leaderboard"}
                        label={"Leaderboard"}
                    />
                    <SidebarItem
                        variant={activeItem === "Badges" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"award"}
                        href={"/badges"}
                        label={"Badges"}
                    />
                    <SidebarItem
                        variant={activeItem === "Shop" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"shop"}
                        href={"/shop"}
                        label={"Shop"}
                    />
                    <SidebarItem
                        variant={activeItem === "Profile" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"person"}
                        href={"/profile"}
                        label={"Profile"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"wand"}
                        href={"/create/dashboard"}
                        label={"Creator"}
                    />
                </div>
            </div>
        </div>
    )
}
