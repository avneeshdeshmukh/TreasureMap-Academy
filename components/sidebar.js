import { cn } from "@/lib/utils"
import Image from "next/image"
import SidebarItem from "./sidebar-item"

export const Sidebar = ({ className }) => {
    return (
        <div className={cn("flex h-full lg:w-[360px] lg:fixed top-0 left-0 px-4  flex-col",
            className)} style={{ backgroundColor: '#2c3748' }}>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold my-2.5 text-center"><Image src="/images/logo.png" width={75} height={50} /></h2>
                <div className="container text-center my-10">
                    <SidebarItem
                        variant={"sidebarOutlineActive"}
                        icon={"house"}
                        href={"#"}
                        label={"Learn"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"medal"}
                        href={"#"}
                        label={"Leaderboard"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"bulb"}
                        href={"#"}
                        label={"Quiz"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"shop"}
                        href={"#"}
                        label={"Shop"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"person"}
                        href={"#"}
                        label={"Profile"}
                    />
                </div>
            </div>
        </div>
    )
}