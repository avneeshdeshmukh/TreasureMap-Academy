import React from 'react';

const HowItWorks = () => {
  return (
    <div className="how-it-works-section py-10 bg-white text-center px-4 sm:px-6 lg:px-12">
    <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
    <p className="mt-4 text-lg text-gray-600">
      Whether you're here to learn or create, we have a simple process for everyone.
    </p>

    <div className="flex flex-col md:flex-row gap-6 mt-10">
      {/* Learner Section */}
      <div className="w-full md:w-1/2 p-6">
        <h3 className="text-2xl font-bold mb-6 text-blue-950">For Learners</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { img: "/gifs/signup.gif", title: "1. Sign Up", desc: "Create an account to start learning." },
            { img: "/gifs/selective.gif", title: "2. Choose a Course", desc: "Explore a variety of courses and pick the one that suits your needs." },
            { img: "/gifs/project.gif", title: "3. Start Learning", desc: "Learn from expert instructors at your own pace." },
            { img: "/gifs/certificate.gif", title: "4. Earn Certificates", desc: "Complete courses and earn industry-recognized certificates." },
          ].map((step, index) => (
            <div key={index} className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60 sm:w-3/4 md:w-full mx-auto">
              <img src={step.img} alt={step.title} className="w-16 h-16 mx-auto mb-4" />
              <h4 className="text-lg sm:text-xl font-bold">{step.title}</h4>
              <p className="mt-2 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Section */}
      <div className="w-full md:w-1/2 p-6">
        <h3 className="text-2xl font-bold mb-6 text-blue-950">For Creators</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { img: "/gifs/signup.gif", title: "1. Sign Up", desc: "Create an account to start creating courses." },
            { img: "/gifs/createcourse.gif", title: "2. Create a Course", desc: "Build your course using our easy-to-use tools." },
            { img: "/gifs/upload.gif", title: "3. Upload Content", desc: "Upload videos, quizzes, and more to complete your course." },
            { img: "/gifs/publishearn.gif", title: "4. Publish & Earn", desc: "Launch your course and earn revenue from enrollments!" },
          ].map((step, index) => (
            <div key={index} className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60 sm:w-3/4 md:w-full mx-auto">
              <img src={step.img} alt={step.title} className="w-16 h-16 mx-auto mb-4" />
              <h4 className="text-lg sm:text-xl font-bold">{step.title}</h4>
              <p className="mt-2 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default HowItWorks;