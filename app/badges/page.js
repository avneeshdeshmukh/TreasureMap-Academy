"use client";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { StreakIcons } from "@/components/streak-icons";
import BadgeUnlockedPreview from "./badge-modal";

const BadgesPage = () => {
  const [badges, setBadges] = useState([
    {
      id: 1,
      name: "Pirate Captain",
      imagePath: "/TMA-badges/TMAbadge-1.jpeg",
      unlocked: false,
      condition: "Complete first mission",
    },
    {
      id: 2,
      name: "Treasure Hunter",
      imagePath: "/TMA-badges/TMAbadge-2.jpeg",
      unlocked: false,
      condition: "Find 5 treasures",
    },
    {
      id: 3,
      name: "Sea Navigator",
      imagePath: "/TMA-badges/TMAbadge-3.jpeg",
      unlocked: false,
      condition: "Sail all 7 seas",
    },
    {
      id: 4,
      name: "Ghost Ship",
      imagePath: "/TMA-badges/TMAbadge-4.jpeg",
      unlocked: false,
      condition: "Defeat the ghost ship",
    },
    {
      id: 5,
      name: "Legendary Sword",
      imagePath: "/TMA-badges/TMAbadge-5.jpeg",
      unlocked: false,
      condition: "Find the legendary sword",
    },
    {
      id: 6,
      name: "Kraken Slayer",
      imagePath: "/TMA-badges/TMAbadge-6.jpeg",
      unlocked: false,
      condition: "Defeat the kraken",
    },
    {
      id: 7,
      name: "Gold Hoarder",
      imagePath: "/TMA-badges/TMAbadge-7.jpeg",
      unlocked: false,
      condition: "Collect 1000 gold",
    },
    {
      id: 8,
      name: "Master Gunner",
      imagePath: "/TMA-badges/TMAbadge-8.jpeg",
      unlocked: false,
      condition: "Hit 50 targets",
    },
    {
      id: 9,
      name: "Crew Leader",
      imagePath: "/TMA-badges/TMAbadge-9.jpeg",
      unlocked: false,
      condition: "Recruit 10 crew members",
    },
    {
      id: 10,
      name: "Island Explorer",
      imagePath: "/TMA-badges/TMAbadge-10.jpeg",
      unlocked: false,
      condition: "Discover 20 islands",
    },
    {
      id: 11,
      name: "Legendary Captain",
      imagePath: "/TMA-badges/TMAbadge-11.jpeg",
      unlocked: false,
      condition: "Reach max level",
    },
    {
      id: 12,
      name: "Davy Jones' Nemesis",
      imagePath: "/TMA-badges/TMAbadge-12.jpeg",
      unlocked: false,
      condition: "Escape Davy Jones' locker",
    },
  ]);

  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to unlock a badge
  const unlockBadge = (id) => {
    const updatedBadges = badges.map((badge) =>
      badge.id === id ? { ...badge, unlocked: true } : badge
    );
  
    setBadges(updatedBadges);
  
    const unlockedBadge = updatedBadges.find((badge) => badge.id === id);
    setUnlockedBadge(unlockedBadge); 
    setShowModal(true);
  };

  return (
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
              width: `${
                (badges.filter((badge) => badge.unlocked).length /
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
                  className={`w-full h-full object-cover ${
                    !badge.unlocked ? "grayscale" : ""
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
                      onClick={() => unlockBadge(badge.id)}
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
