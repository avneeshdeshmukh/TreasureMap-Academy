"use client";
import React from "react";
import Link from "next/link";

const Homehero = () => {

  return (
    <div>
    <div className="heroimage flex flex-col lg:flex-row justify-start items-center px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto -mt-14">
      {/* Image Section */}
      <div className="w-full lg:w-1/2 pt-12 sm:pt-16 lg:pt-20">
        <img
          src="/images/grppic2.png"
          alt="Group Pic"
          className="w-full max-w-[450px] px-4 sm:px-6 lg:px-10 mx-auto"
        />
      </div>

      {/* Text Section */}
      <div className="heroText w-full lg:w-1/2 px-4 sm:px-6 lg:px-0 lg:ml-24 pt-8 lg:pt-28 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-gray-900 tracking-wide font-bold mb-2">
          Join the crew
        </h2>
        
        <h1 className="text-3xl sm:text-4xl text-blue-950 font-bold flex flex-wrap gap-2 items-center mb-4">
          Every lesson is a hidden gem
          <span className="inline-flex">
            <img src="/gifs/treasure-chest.gif" className="w-10 sm:w-12" alt="" />
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-gray-500 mb-6">
          At our platform, we believe that learning should be an adventure
          filled with discovery and growth. Each lesson is crafted with care
          to provide you with the knowledge and skills you need to succeed.
          From interactive quizzes that keep you engaged to hands-on
          projects that enhance your understanding, our courses are designed
          to be both informative and enjoyable. With industry experts as
          your guides, you will gain insights that are not just theoretical
          but practical and applicable in real-world scenarios.
        </p>
        
        <Link 
          href="/signup"
          className="inline-block no-underline appearance-none bg-blue-950 hover:bg-yellow-400 text-white rounded-2xl px-6 py-3 text-sm sm:text-base transition-colors duration-200"
        >
          Join The Adventure!
        </Link>
      </div>
    </div>
  </div>
  );
};

export default Homehero;