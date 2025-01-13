"use client"

import { MobileHeader } from "@/components/mobile-header"
import { CreatorSidebar } from "@/components/creatorDashboard/creatorsidebar"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "../context/AuthProvider"
import { useRouter } from "next/navigation"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useEffect } from "react"

const firestore = getFirestore();

export default function CreatorMainLayout({ children }) {
    const router = useRouter();
    const { user } = useAuth();
    useEffect(() => {
        if (!user){
            router.push('/login')
        }
        const checkCreatorFlag = async () => {
            try {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                const creatorFlag = userData.isCreator;

                if (!creatorFlag) {
                    router.push('/creator-profile')
                }
            }
            catch (err) {
                console.log(err.message)
            }
        }
        checkCreatorFlag();
    },[user, router]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#ede9de] pt-5">
                <MobileHeader platform={"creator"} />
                <CreatorSidebar className="hidden lg:flex" />
                <main className="lg:pl-[360px] h-full pt-[50px] lg:pt-0">
                    <div className="max-w-[1056px] mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}