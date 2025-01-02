import { MobileHeader } from "@/components/mobile-header"
import { CreatorSidebar } from "@/components/creatorDashboard/creatorsidebar"

export default function MainLayout({ children }) {
   
    return (
        <div
            style={{
                background: "", // Replace with a solid background color
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <MobileHeader />
            <CreatorSidebar className="hidden lg:flex" />
            <main className="lg:pl-[360px] h-full pt-[50px] lg:pt-0">
                <div className="max-w-[1056px] mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}