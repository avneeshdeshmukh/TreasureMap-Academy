'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import SidebarItem from "./sidebar-item";

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState("");

    useEffect(() => {
        const currentTitle = document.title.toLowerCase();

        if (currentTitle.includes("leaderboard")) {
            setActiveItem("Leaderboard");
        } else if (currentTitle.includes("learn")) {
            setActiveItem("Learn");
        } else if (currentTitle.includes("quiz")) {
            setActiveItem("Quiz");
        } else if (currentTitle.includes("courses")) {
            setActiveItem("Courses");
        } else if (currentTitle.includes("profile")) {
            setActiveItem("Profile");
        }
    }, []);
    return (
        <div className="w-1/4 fixed h-screen top-0 left-0 text-white p-4" style={{ backgroundColor: '#2c3748' }}>
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
                        icon={"medal"}
                        href={"/leaderboard"}
                        label={"Leaderboard"}
                    />
                    <SidebarItem
                        variant={activeItem === "Quiz" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"bulb"}
                        href={"#"}
                        label={"Quiz"}
                    />
                    <SidebarItem
                        variant={activeItem === "Courses" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"shop"}
                        href={"/courses"}
                        label={"Courses"}
                    />
                    <SidebarItem
                        variant={activeItem === "Profile" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"person"}
                        href={"/profile"}
                        label={"Profile"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
