import { cn } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation";
import SidebarItem from "../sidebar-item"

export const CreatorSidebar = ({ className }) => {
    const pathname = usePathname(); // Get the current path

    // Determine the active item based on the pathname
    const getActiveItem = () => {
        if (pathname.includes("/dashboard")) return "Dashboard";
        if (pathname.includes("/mycourses")) return "My Courses";
        if (pathname.includes("/progress")) return "Progress";
        if (pathname.includes("/settings")) return "Settings";
        return "";
    };

    const activeItem = getActiveItem();
    return (
        <div className={cn("flex h-full lg:w-[360px] lg:fixed top-0 left-0 px-4  flex-col bg-[#3c1a53]",
            className)} >
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold my-2.5 text-center"><Image src="/images/logo.png" width={75} height={50} /></h2>
                <div className="container text-center my-10">
                    <SidebarItem
                        variant={activeItem === "Dashboard" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"house"}
                        href={"/create/dashboard"}
                        label={"Dashboard"}
                    />
                    <SidebarItem
                        variant={activeItem === "My Courses" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"book"}
                        href={"/create/mycourses"}
                        label={"My Courses"}
                    />
                    <SidebarItem
                        variant={activeItem === "Progress" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"chart"}
                        href={"/create/progress"}
                        label={"Progress"}
                    />
                    <SidebarItem
                        variant={activeItem === "Settings" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"settings"}
                        href={"/create/settings"}
                        label={"Settings"}
                    />
                    <SidebarItem
                        variant={activeItem === "Learner" ? "sidebarOutlineActive" : "sidebarOutline"}
                        icon={"wand"}
                        href={"/profile"}
                        label={"Learner"}
                    />
                </div>
            </div>
        </div>
    )
}