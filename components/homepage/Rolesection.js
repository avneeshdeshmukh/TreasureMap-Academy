"use client";
import Link from "next/link";
import React, { useState } from "react";

const Rolesection = () => {
  const [activeTab, setActiveTab] = useState("learner");

  return (
    <div className="py-16">
      {/* Tabs Navigation */}
      <div className="flex justify-center gap-96 mb-6">
        <button
          onClick={() => setActiveTab("learner")}
          className={`px-6 py-3 font-semibold text-lg rounded-md transition duration-300 ${
            activeTab === "learner"
              ? "bg-yellow-300 text-black font-bold"
              : "bg-blue-950 text-white hover:bg-yellow-400"
          }`}
        >
          LEARNER
        </button>
        <button
          onClick={() => setActiveTab("creator")}
          className={`px-6 py-3 font-semibold text-lg rounded-md transition duration-300 ${
            activeTab === "creator"
              ? "bg-yellow-300 text-black font-bold"
              : "bg-blue-950 text-white hover:bg-yellow-400"
          }`}
        >
          CREATOR
        </button>
      </div>

      {/* Tabs Content */}
      <div className="max-w-[90%] mx-auto bg-white shadow-md rounded-md p-6 text-gray-600 text-lg">
        {activeTab === "learner" && (
          <div className="flex flex-col md:flex-row-reverse items-center md:items-start md:px-16">
            <img
              src="/images/homelearner2.png"
              alt="Group Pic"
              className="w-80 md:w-96 px-5 pt-10"
            />
            <div className="md:mr-24 px-4 md:px-0 text-base md:text-lg pt-4 text-center md:text-left">
              <h3 className="text-3xl text-gray-900 tracking-wide">
                Unlock New Skills at Treasure Map Academy
              </h3>
              <h1 className="text-4xl text-blue-950 font-bold flex gap-2 items-center">
                Discover Your Learning Adventure
                <span className="-ml-4">
                  <img
                    src="/gifs/rock-climbing.gif"
                    alt="Treasure Chest"
                    className="w-32"
                  />
                </span>
              </h1>
              <p className="text-lg text-gray-500 mt-4">
                Embark on an exciting journey of discovery with our carefully
                crafted lessons. Each course is a hidden gem designed to unlock
                your potential and guide you step-by-step through new skills and
                knowledge. Whether you're a beginner or an expert, there's
                always something new to uncover!
              </p>
              <p className="text-lg text-gray-500 mt-4">
                Explore diverse topics, interact with mentors, and participate
                in hands-on projects to apply your learning. Join our community
                of curious learners today and start your adventure!
              </p>
              <div className="mt-6">
                <Link href="/signup" className="bg-blue-950 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition duration-300">
                    Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "creator" && (
          <div className="flex flex-col md:flex-row items-center md:items-start md:px-16">
            <img
              src="/images/homecreator.jpg"
              alt="Group Pic"
              className="w-80 md:w-96 px-5 pt-10"
            />
            <div className="md:ml-24 px-4 md:px-0 text-base md:text-lg pt-4 text-center md:text-left">
              <h3 className="text-3xl text-gray-900 tracking-wide">
                Craft Your Future with Treasure Map Academy
              </h3>
              <h1 className="text-4xl text-blue-950 font-bold flex gap-2 items-center">
                Join the Adventure of Learning
                <span className="-ml-4">
                  <img
                    src="/gifs/lighthouse.gif"
                    alt="Treasure Chest"
                    className="w-32"
                  />
                </span>
              </h1>
              <p className="text-lg text-gray-500 mt-4">
                At Treasure Map Academy, you can upload your own courses and
                create engaging, customizable quizzes that captivate students.
                Design courses tailored to your audience’s interests for a
                unique learning experience.
              </p>
              <p className="text-lg text-gray-500 mt-4">
                Explore a variety of courses based on your preferences and
                collaborate with fellow creators. Whether you’re an experienced
                educator or a passionate innovator, Treasure Map Academy offers
                exciting opportunities for growth!
              </p>
              <div className="mt-6">
                <Link href="/signup" className="bg-blue-950 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition duration-300">
                    Sign Up
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
