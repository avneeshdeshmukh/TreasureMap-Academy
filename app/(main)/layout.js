import { MobileHeader } from "@/components/mobile-header"
import { Sidebar } from "@/components/sidebar"

export default function MainLayout({ children }) {
   
    return (
        <div  style={{
            background: `linear-gradient(
              rgba(0, 0, 0, 0.750), 
              rgba(0, 0, 0, 0.750)
            ), url('/images/bg-17.jpg')`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat',
            backgroundAttachment : 'fixed'
          }}>
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="lg:pl-[360px] h-full pt-[50px] lg:pt-0">
                <div className="max-w-[1056px] mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}