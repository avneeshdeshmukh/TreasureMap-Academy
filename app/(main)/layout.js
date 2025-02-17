'use client'

import { MobileHeader } from "@/components/mobile-header"
import ProtectedRoute from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"

export default function MainLayout({ children }) {

    return (
        <ProtectedRoute>
            <div 
                className="min-h-full"
            >
                <MobileHeader platform={"learner"} />
                <Sidebar className="hidden lg:flex" />
                <main className="lg:pl-[360px] h-full pt-[50px] lg:pt-0">
                    <div className="max-w-[1056px] mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}