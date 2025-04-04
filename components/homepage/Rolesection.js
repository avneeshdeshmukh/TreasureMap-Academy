"use client";
import Link from "next/link";
import React, { useState } from "react";

const Rolesection = () => {
  const [activeTab, setActiveTab] = useState("learner");

  return (
    <div className="py-8 sm:py-12 lg:py-16">
    {/* Tabs Navigation */}
    <div className="flex justify-center gap-4 sm:gap-8 lg:gap-96 mb-8 px-4">
      <button
        onClick={() => setActiveTab("learner")}
        className={`px-6 py-3 font-semibold text-base sm:text-sm rounded-2xl shadow-md transition-all duration-300 flex-1 sm:flex-none max-w-[200px] ${
          activeTab === "learner"
            ? "bg-yellow-300 text-black font-bold transform scale-105"
            : "bg-blue-950 text-white hover:bg-blue-800 hover:transform hover:scale-105"
        }`}
      >
        LEARNER
      </button>
      <button
        onClick={() => setActiveTab("creator")}
        className={`px-6 py-3 font-semibold text-base sm:text-sm rounded-2xl shadow-md transition-all duration-300 flex-1 sm:flex-none max-w-[200px] ${
          activeTab === "creator"
            ? "bg-yellow-300 text-black font-bold transform scale-105"
            : "bg-blue-950 text-white hover:bg-blue-800 hover:transform hover:scale-105"
        }`}
      >
        CREATOR
      </button>
    </div>

    {/* Tabs Content */}
    <div className="max-w-[95%] sm:max-w-[90%] mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8">
      {activeTab === "learner" && (
        <div className="flex flex-col lg:flex-row-reverse items-center gap-6 lg:gap-12">
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/images/homelearner2.png"
              alt="Learner"
              className="w-64 sm:w-80 lg:w-96 object-contain"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl sm:text-2xl text-gray-900 tracking-wide">
              Unlock New Skills at Treasure Map Academy
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-center lg:justify-start">
              <h1 className="text-xl sm:text-3xl text-blue-950 font-bold">
                Discover Your Learning Adventure
              </h1>
              <img
                src="/gifs/rock-climbing.gif"
                alt="Rock Climbing"
                className="w-5 sm:w-28"
              />
            </div>
            <p className="text-base sm:text-md text-gray-500">
              Embark on an exciting journey of discovery with our carefully
              crafted lessons. Each course is a hidden gem designed to unlock
              your potential and guide you step-by-step through new skills and
              knowledge. Whether you&apos;re a beginner or an expert, there&apos;s
              always something new to uncover!
            </p>
            <p className="text-base sm:text-md text-gray-500">
              Explore diverse topics, interact with mentors, and participate
              in hands-on projects to apply your learning. Join our community
              of curious learners today and start your adventure!
            </p>
            <div className="pt-4">
              <Link 
                href="/signup" 
                className="inline-block bg-blue-950 text-white px-8 py-3 rounded-2xl text-md font-semibold hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === "creator" && (
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/images/homecreator.jpg"
              alt="Creator"
              className="w-64 sm:w-80 lg:w-96 object-contain rounded-lg shadow-md"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl sm:text-2xl text-gray-900 tracking-wide">
              Craft Your Future with Treasure Map Academy
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-center lg:justify-start">
              <h1 className="text-xl sm:text-3xl text-blue-950 font-bold">
                Join the Adventure of Learning
              </h1>
              <img
                src="/gifs/lighthouse.gif"
                alt="Lighthouse"
                className="w-5 sm:w-28"
              />
            </div>
            <p className="text-base sm:text-md text-gray-500">
              At Treasure Map Academy, you can upload your own courses and
              create engaging, customizable quizzes that captivate students.
              Design courses tailored to your audience&apos;s interests for a
              unique learning experience.
            </p>
            <p className="text-base sm:text-md text-gray-500">
              Explore a variety of courses based on your preferences and
              collaborate with fellow creators. Whether you&apos;re an experienced
              educator or a passionate innovator, Treasure Map Academy offers
              exciting opportunities for growth!
            </p>
            <div className="pt-4">
              <Link 
                href="/signup" 
                className="inline-block bg-blue-950 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Become a Creator
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Rolesection;
