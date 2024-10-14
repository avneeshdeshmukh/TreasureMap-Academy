"use client";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./home.css";

const Rolesection = () => {
  return (
    <div>
      <div className="py-16">
        <Tabs
          defaultActiveKey="learner"
          id="justify-tab-example"
          className="mb-3 justify-center bg-blue-950 p-3 max-w-[172vh] mx-auto gap-[90vh] rounded-md"
        >
          {/* Home Tab */}
          <Tab
            eventKey="learner"
            title="LEARNER"
            tabClassName="custom-tab text-white font-semibold bg-yellow-300 hover:bg-yellow-400 hover:text-black hover:font-bold border-b-2 border-transparent transition-all duration-300 active:bg-yellow-500"
          >
            <div className="text-gray-600 text-lg p-4 bg-white shadow-md rounded-md flex max-w-[172vh] justify-center items-center mb-3 mx-auto">
              {/* Tab content for Home */}
              <div className="learner relative">
                <div className="learnerimage flex flex-col md:flex-row-reverse justify-start items-center md:items-start md:px-16">
                  <img
                    src="/images/homelearner2.png" // Path to your image
                    width={350}
                    alt="Group Pic"
                    className="px-10 pt-20 relative"
                  />
                  <div className="heroText md:mr-24 px-9 md:px-0 text-base md:text-lg pt-2">
                    <h3 className="text-3xl text-gray-900 tracking-wide">
                      Unlock New Skills at Treasure Map Academy
                    </h3>
                    <h1 className="text-4xl text-blue-950 font-bold flex gap-2 items-center">
                      Discover Your Learning Adventure
                      <span className="-ml-4">
                        <img
                          src="/gifs/rock-climbing.gif"
                          width={140}
                          alt="Treasure Chest"
                        />
                      </span>
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">
                      Embark on an exciting journey of discovery with our
                      carefully crafted lessons. Each course is a hidden gem
                      designed to unlock your potential and guide you
                      step-by-step through new skills and knowledge. Whether
                      you're a beginner or an expert, there's always something
                      new to uncover!
                    </p>
                    <p className="text-lg text-gray-500 mt-4">
                      Explore diverse topics, interact with mentors, and
                      participate in hands-on projects to apply your learning.
                      Join our community of curious learners today and start
                      your adventure!
                    </p>
                  </div>
                </div>
                <div className="learnerButtons bg-blue-950 w-28 h-12 text-white rounded-2xl text-center text-md hover:bg-blue-600 p-2 ml-16">
                  <button>Sign Up</button>
                </div>
              </div>
            </div>
          </Tab>

          {/* Profile Tab */}
          <Tab
            eventKey="creator"
            title="CREATOR"
            tabClassName="custom-tab text-white font-semibold bg-yellow-300 hover:bg-yellow-400 hover:text-white hover:font-bold border-b-2 border-transparent transition-all duration-300 active:bg-yellow-500"
          >
            <div className="text-gray-600 text-lg p-4 bg-white shadow-md rounded-md flex max-w-[172vh] justify-center items-center mb-3 mx-auto">
              {/* Tab content for Creator */}
              <div className="creator relative">
                <div className="creatorimage flex flex-col md:flex-row justify-start items-center md:items-start md:px-16">
                  <img
                    src="/images/homecreator.jpg" // Path to your image
                    width={400}
                    alt="Group Pic"
                    className="px-5 pt-20 -pl-10 relative"
                  />
                  <div className="heroText md:ml-24 px-9 md:px-0 text-base md:text-lg pt-2">
                    <h3 className="text-3xl text-gray-900 tracking-wide">
                      Craft Your Future with Treasure Map Academy
                    </h3>
                    <h1 className="text-4xl text-blue-950 font-bold flex gap-2 items-center">
                      Join the Adventure of Learning
                      <span className="-ml-4">
                        <img
                          src="/gifs/lighthouse.gif"
                          width={120}
                          alt="Treasure Chest"
                        />
                      </span>
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">
                      At Treasure Map Academy, you can upload your own courses
                      and create engaging, customizable quizzes that captivate
                      students. Design courses tailored to your audience’s
                      interests for a unique learning experience.
                    </p>
                    <p className="text-lg text-gray-500 mt-4">
                      Explore a variety of courses based on your preferences and
                      collaborate with fellow creators. Whether you’re an
                      experienced educator or a passionate innovator, Treasure
                      Map Academy offers exciting opportunities for growth!
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  {/* Add margin for spacing */}
                  <div className="learnerButtons bg-blue-950 w-28 h-12 text-white rounded-2xl text-center text-md hover:bg-blue-600 p-2 mr-16">
                    <button>Sign Up</button>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Rolesection;