"use client";

import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const firestore = getFirestore();

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Assuming useAuth provides loading state

  // Define all hooks at the top level, unconditionally
  const [userData, setUserData] = useState(null);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(0);
  // const [createdDate, setCreatedDate] = useState(0); // Commented out as in original

  useEffect(() => {
    if (user) {
      const getUserData = async () => {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            // Extract and format the createdAt field
            if (userData.createdAt) {
              const createdAtDate = userData.createdAt.toDate();
              const formattedDate = createdAtDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              userData.formattedCreatedAt = formattedDate;
            }

            setUserData(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      const getUserProgress = async () => {
        try {
          const userProgRef = doc(firestore, "userProgress", user.uid);
          const userSnap = await getDoc(userProgRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setCoins(data.coins || 0);
            setStreak(data.streak || 0);

            let totalLessons = 0;
            let totalQuizzes = 0;

            if (data.courseProgress) {
              Object.values(data.courseProgress).forEach((course) => {
                totalLessons += course.currentVideo - 1 || 0;
                totalQuizzes += course.quizzesCompleted || 0;
              });
            }

            setLessonsCompleted(totalLessons);
            setQuizCompleted(totalQuizzes);
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        }
      };

      getUserData();
      getUserProgress();
    }
  }, [user?.uid]); // Consistent dependency as in original

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  // Handle rendering based on authentication and data states
  if (loading) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!userData) {
    return <div className="text-center mt-12">Loading user data...</div>;
  }

  // Render the profile page (unchanged from original)
  return (
    <div className="min-h-screen bg-[#1a2332] text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* User Info Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-gray-600">
          <div className="w-28 h-28 relative">
            <Image
              src={user.photoURL || "/images/login_pirate.png"}
              alt="User Avatar"
              layout="fill"
              className="rounded-full border-4 border-yellow-400"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold">{user.displayName}</h1>
            <p className="text-yellow-400 text-lg">@{userData?.username}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: lessonsCompleted, label: "📚 Lessons" },
            { value: quizCompleted, label: "📝 Quizzes" },
            { value: coins, label: "💰 Coins" },
            { value: streak, label: "🔥 Streak" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center bg-yellow-500 py-6 rounded-lg shadow-md"
            >
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="font-semibold text-[#3d2205]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Account Details Section */}
        <div className="mt-12 pt-6 border-t border-gray-600">
          <h2 className="text-2xl font-bold">Account Details</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Email:", value: user.email },
              { label: "Joined:", value: userData?.formattedCreatedAt },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between bg-gray-800 p-4 rounded-lg shadow"
              >
                <span className="text-gray-400">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/editProfile">
            <Button variant={"secondary"} className="w-full">
              Edit Profile
            </Button>
          </Link>

          <Button variant={"danger"} className="" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}