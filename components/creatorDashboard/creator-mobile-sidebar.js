import {
    Sheet,
    SheetTrigger,
    SheetContent
} from "@/components/ui/sheet"
import {CreatorSidebar} from "@/components/creatorDashboard/creatorsidebar"
import { Menu } from "lucide-react"

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="text-white" />
            </SheetTrigger>
            <SheetContent className="p-0 z-[100]" side="left">
                <CreatorSidebar />
            </SheetContent>
        </Sheet>
    )
}