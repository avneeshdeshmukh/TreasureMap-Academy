import { MobileSidebar } from "@/components/mobile-sidebar"
import { CreatorMobileSidebar } from "./creatorDashboard/creator-mobile-sidebar"

export const MobileHeader = ({ platform }) => {
    return (
        <nav className="lg:hidden px-6 h-[50px] flex items-center bg-yellow-400 border-b fixed top-0 w-full z-50">
            {platform === 'learner' ? <MobileSidebar /> : <CreatorMobileSidebar />}
        </nav>
    )
}