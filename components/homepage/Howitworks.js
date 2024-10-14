import React from 'react';

const HowItWorks = () => {
  return (
    <div className="how-it-works-section py-10 bg-white text-center">
      <h2 className="text-4xl font-bold">How It Works</h2>
      <p className="mt-4 text-lg text-gray-600">
        Whether you're here to learn or create, we have a simple process for everyone.
      </p>
      
      <div className="flex flex-col md:flex-row justify-around mt-10">
        {/* Learner Section */}
        <div className="learner-section w-full md:w-1/2 p-6">
          <h3 className="text-2xl font-bold mb-6 text-blue-950">For Learners</h3>
          
          <div className="steps-grid grid grid-cols-2 gap-4">
            {/* Step 1: Sign Up */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/signup.gif"
                alt="Sign Up"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">1. Sign Up</h4>
              <p className="mt-2 text-gray-600">
                Create an account to start learning.
              </p>
            </div>

            {/* Step 2: Choose a Course */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/selective.gif"
                alt="Choose a Course"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">2. Choose a Course</h4>
              <p className="mt-2 text-gray-600">
                Explore a variety of courses and pick the one that suits your needs.
              </p>
            </div>

            {/* Step 3: Start Learning */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/project.gif"
                alt="Start Learning"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">3. Start Learning</h4>
              <p className="mt-2 text-gray-600">
                Learn from expert instructors at your own pace.
              </p>
            </div>

            {/* Step 4: Earn Certificates */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/certificate.gif"
                alt="Earn Certificates"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">4. Earn Certificates</h4>
              <p className="mt-2 text-gray-600">
                Complete courses and earn industry-recognized certificates.
              </p>
            </div>
          </div>
        </div>

        {/* Creator Section */}
        <div className="creator-section w-full md:w-1/2 p-6">
          <h3 className="text-2xl font-bold mb-6 text-blue-950">For Creators</h3>

          <div className="steps-grid grid grid-cols-2 gap-4">
            {/* Step 1: Sign Up */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/signup.gif"
                alt="Sign Up"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">1. Sign Up</h4>
              <p className="mt-2 text-gray-600">
                Create an account to start creating courses.
              </p>
            </div>

            {/* Step 2: Create a Course */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/createcourse.gif"
                alt="Create a Course"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">2. Create a Course</h4>
              <p className="mt-2 text-gray-600">
                Build your course using our easy-to-use tools.
              </p>
            </div>

            {/* Step 3: Upload Content */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/upload.gif"
                alt="Upload Content"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">3. Upload Content</h4>
              <p className="mt-2 text-gray-600">
                Upload videos, quizzes, and more to complete your course.
              </p>
            </div>

            {/* Step 4: Publish and Earn */}
            <div className="step-card p-4 shadow-lg bg-gray-100 rounded-lg flex flex-col justify-between h-60">
              <img
                src="/gifs/publishearn.gif"
                alt="Publish and Earn"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold">4. Publish & Earn</h4>
              <p className="mt-2 text-gray-600">
                Launch your course and earn revenue from enrollments!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;