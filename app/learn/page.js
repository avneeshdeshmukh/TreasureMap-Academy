"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/learn/Sidebar";
import TopButton from "@/components/learn/TopButton";
import { LessonButton } from "./LessonButton";
import Header from "@/components/learn/Header";
import Stats from "@/components/learn/Stats";
import LeaderboardPos from "@/components/learn/leaderboard-position";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Ensure sidebar is visible on large screens
      }
    };

    // Set the initial state based on screen size
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const lessons = [
    {
      id: "1",
      index: 0,
      totalCount: 14,
      locked: false,
      current: false,
      percentage: 100,
    },
    {
      id: "2",
      index: 1,
      totalCount: 14,
      locked: false,
      current: false,
      percentage: 100,
    },
    {
      id: "3",
      index: 2,
      totalCount: 14,
      locked: false,
      current: true,
      percentage: 60,
    },
    {
      id: "4",
      index: 3,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
    {
      id: "5",
      index: 4,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
    {
      id: "6",
      index: 5,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
    {
      id: "7",
      index: 6,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
    {
      id: "8",
      index: 7,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
    {
      id: "9",
      index: 8,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
    {
      id: "10",
      index: 9,
      totalCount: 14,
      locked: true,
      current: false,
      percentage: 0,
    },
  ];
  return (
    <div
      style={{
        background: `linear-gradient(
      rgba(0, 0, 0, 0.750), 
      rgba(0, 0, 0, 0.750)
    ), url('/images/bg-17.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      className="min-h-screen"
    >
      <Header />

      {/* Top Buttons */}
      <TopButton
        right="30px"
        href={"#"}
        type="coins"
        color={"none"}
        outline={"#facc15"}
        num={300}
      />
      <TopButton
        right="120px"
        href={"#"}
        type="flame"
        color={"orange"}
        outline={"none"}
        num={45}
      />

      <div className="flex flex-row">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="z-40 bg-gray-800 p-4 lg:relative lg:block">
            <Sidebar />
          </div>
        )}

        {/* Sidebar Toggle Button */}
        <button
          className={`p-2 text-white bg-yellow-500 rounded-md absolute top-4 left-4 z-50 lg:hidden`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close Menu" : "Menu"}
        </button>

        {/* Main Content */}
        <main className="flex-1 flex justify-center items-center">
          <div className="lesson-container relative mt-24 ml-20">
            {lessons.map((lesson, index) => (
              <LessonButton
                key={lesson.id}
                {...lesson}
                index={index}
                totalCount={lessons.length}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Leaderboard and Stats */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
        <LeaderboardPos />
        <Stats />
      </div>
    </div>
  );
}
