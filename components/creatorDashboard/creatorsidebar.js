import { cn } from "@/lib/utils"
import Image from "next/image"
import SidebarItem from "../sidebar-item"

export const CreatorSidebar = ({ className }) => {
    return (
        <div className={cn("flex h-full lg:w-[360px] lg:fixed top-0 left-0 px-4  flex-col",
            className)} style={{ backgroundColor: '#090b9b' }}>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold my-2.5 text-center"><Image src="/images/logo.png" width={75} height={50} /></h2>
                <div className="container text-center my-10">
                    <SidebarItem
                        variant={"sidebarOutlineActive"}
                        icon={"house"}
                        href={"#"}
                        label={"Dashboard"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"book"}
                        href={"#"}
                        label={"My Courses"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"chart"}
                        href={"#"}
                        label={"Progress"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"users"}
                        href={"#"}
                        label={"Community"}
                    />
                    <SidebarItem
                        variant={"sidebarOutline"}
                        icon={"settings"}
                        href={"#"}
                        label={"Settings"}
                    />
                </div>
            </div>
        </div>
    )
}