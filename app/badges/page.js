"use client";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { StreakIcons } from "@/components/streak-icons";
import BadgeUnlockedPreview from "./badge-modal";
import { badgeObjects } from "@/lib/data";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";



const BadgesPage = () => {
  const firestore = getFirestore();

  const userId = auth.currentUser.uid;
  const userProgRef = doc(firestore, "userProgress", userId);
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState(badgeObjects);
  const [coins, setCoins] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(0);

  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const userSnap = await getDoc(userProgRef);
      const data = userSnap.data();

      setUserData(data);
      const unlockedBadges = data.unlockedBadges ?? [];
      const updatedBadges = badgeObjects.map((badge) => ({
        ...badge,
        unlocked: unlockedBadges.includes(badge.name), // Set unlocked to true if name is in unlockedBadges
      }));
      console.log(updatedBadges);
      setBadges(updatedBadges);

      let totalLessons = 0;
      let totalQuizzes = 0;


      if (data.courseProgress) {
        Object.values(data.courseProgress).forEach((course) => {
          totalLessons += course.currentVideo - 1 || 0;
          totalQuizzes += course.quizzesCompleted || 0;
        });
      }
      
      setCoins(data.coins);
      setLessonsCompleted(totalLessons);
      setQuizCompleted(totalQuizzes);
    }

    getUserData();
  }, [userId])

  const isBadgeUnlockable = (givenCoins, givenLessons, givenQuizzes) => {
    if (givenCoins <= coins && givenLessons <= lessonsCompleted && givenQuizzes <= quizCompleted) {
      return true;
    }
    return false;
  }


  // Function to unlock a badge
  const unlockBadge = async (name) => {
    const currentBadge = badges.find((badge) => badge.name === name);
    if (!isBadgeUnlockable(currentBadge.coins, currentBadge.lessons, currentBadge.quizzes)) {
      alert("Not eligible for badge");
      return;
    }
    const updatedBadges = badges.map((badge) =>
      badge.name === name ? { ...badge, unlocked: true } : badge
    );

    setBadges(updatedBadges);



    const currentBadges = userData?.unlockedBadges ?? []; // Fallback to empty array if undefined
    const newBadgeArray = [...currentBadges, name]; // Add new badge name to array

    try {
      await updateDoc(userProgRef, {
        unlockedBadges: newBadgeArray, // Update the unlockedBadges field
      });
      // Update local userData state to reflect the change
      setUserData((prev) => ({
        ...prev,
        unlockedBadges: newBadgeArray,
      }));
    } catch (error) {
      console.error("Error updating unlockedBadges in Firestore:", error);
    }
    setUnlockedBadge(currentBadge);
    setShowModal(true);
  };

  return (
    userData &&
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pirate Badges Collection
      </h1>
      {/* Progress tracker */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Progress:</span>
          <span>
            {badges.filter((badge) => badge.unlocked).length} / {badges.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div
            className="bg-yellow-400 h-5 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${(badges.filter((badge) => badge.unlocked).length /
                badges.length) *
                100
                }%`,
            }}
          ></div>
        </div>
      </div>
      {/* Badge grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="relative h-80">

            <div
              className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col p-3
                ${badge.unlocked ? "border-2 border-green-500" : "opacity-70"}`}
            >
              {/* Badge Image */}
              <div className="relative w-full h-40 flex-shrink-0">
                <img
                  src={badge.imagePath}
                  alt={badge.name}
                  className={`w-full h-full object-cover ${!badge.unlocked ? "grayscale" : ""
                    }`}
                />
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Badge Info */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-center">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {badge.condition}
                  </p>
                </div>

                {/* Ensure button is always positioned correctly */}
                <div className="mt-auto">
                  {!badge.unlocked ? (
                    <button
                      onClick={() => unlockBadge(badge.name)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Unlock
                    </button>
                  ) : (
                    <div className="flex items-center justify-center text-green-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-sm">Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && unlockedBadge && (
        <BadgeUnlockedPreview badge={unlockedBadge} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BadgesPage;
