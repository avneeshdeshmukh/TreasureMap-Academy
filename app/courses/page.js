"use client";

import Sidebar from "@/components/learn/Sidebar";
import { useAuth } from "@/app/context/AuthProvider"; // Import your custom AuthProvider
import { auth } from "@/lib/firebase"; // Firebase auth instance
import { signOut } from "firebase/auth"; // Firebase sign-out function
import { useRouter } from "next/navigation";

export default function CoursesPage() {
    const { user } = useAuth(); // Access the authenticated user from context
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth); // Firebase sign-out
            router.push("/home"); // Redirect to home page after sign-out
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#f5f5dc" }}>
            <Sidebar />
            {user && (
                <div className="flex flex-col flex-1 p-3 mb-auto ml-64">
                    <h1 className="text-3xl font-bold text-center mt-4">
                        Welcome, {user.displayName || "User"}!
                    </h1>
                    <br />
                    <br />
                    <div className="italic text-center">You do not have any courses yet....</div>
                    <div className="flex items-center justify-center mx-auto w-1/2 my-3">
                        <button
                            onClick={handleSignOut}
                            className="text-center bg-slate-300 p-3 rounded-xl"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
