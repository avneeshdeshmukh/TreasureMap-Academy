"use client";
import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Rolesection from "@/components/homepage/Rolesection";

const Homehero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration (in ms)
      once: true, // Whether animation should happen only once or every scroll
      easing: "ease-in-out",
      offset: 0, // Offset (in pixels) from the original trigger point
    });
  }, []);

  return (
    <>
      <div className="hero relative">
        <div className="heroimage flex flex-col md:flex-row justify-start items-center md:items-start md:px-16">
          <img
            src="/images/grppic2.png"
            width={450}
            alt="Group Pic"
            className="px-10 pt-20 relative"
          />
          {/* <p className="md:ml-8 px-9 md:px-0 text-base md:text-lg pt-44">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum in nostrum laboriosam hic necessitatibus molestiae dolor voluptatibus incidunt dignissimos rem adipisci velit sapiente obcaecati praesentium, illum, explicabo minima magni unde!</p> */}
          <div className="heroText md:ml-24 px-9 md:px-0 text-base md:text-lg pt-28">
            <h2 className="text-3xl text-gray-900 tracking-wide font-bold">
              Join the crew
            </h2>
            <h1 className="text-4xl text-blue-950 font-bold flex gap-2 items-center">
              Every lesson is a hidden gem{" "}
              <span>
                <img src="/gifs/treasure-chest.gif" width={50} alt="" />
              </span>
            </h1>
            <p className="text-lg text-gray-500 gt-2">
              At our platform, we believe that learning should be an adventure
              filled with discovery and growth. Each lesson is crafted with care
              to provide you with the knowledge and skills you need to succeed.
              From interactive quizzes that keep you engaged to hands-on
              projects that enhance your understanding, our courses are designed
              to be both informative and enjoyable. With industry experts as
              your guides, you will gain insights that are not just theoretical
              but practical and applicable in real-world scenarios.
            </p>
            <div className="learnerButtons bg-blue-950 w-fit h-12 text-white rounded-2xl text-center text-md hover:bg-blue-600 p-4 flex justify-center items-center">
              <button>Join the adventure!</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homehero;
