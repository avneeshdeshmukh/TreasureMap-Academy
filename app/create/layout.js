"use client"

import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "../context/AuthProvider"
import { useRouter } from "next/navigation"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useEffect } from "react"
import { CoinsProvider } from "../context/CoinsContext"
import { StreakProvider } from "../context/StreakContext"

const firestore = getFirestore();

export default function CreateLayout({ children }) {
    const router = useRouter();
    const { user } = useAuth();
    useEffect(() => {
        if (!user) {
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
    }, [user, router]);

    return (
        <ProtectedRoute>
            <CoinsProvider>
                <StreakProvider>
                    <div className="min-h-screen bg-[#efeeea] max-w-full">
                        {children}
                    </div>
                </StreakProvider>
            </CoinsProvider>
        </ProtectedRoute>
    )
}