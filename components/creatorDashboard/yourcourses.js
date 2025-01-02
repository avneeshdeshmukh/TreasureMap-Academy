"use client";

const YourCourses = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl px-4">
      <h2 className="text-2xl font-bold text-[#5a3b1a] mb-4">Your Courses</h2>
      <div className="courses-container bg-[#f8f4eb] flex flex-col items-center justify-center border border-dashed border-[#d1c4a8] rounded-lg py-8">
        <p className="text-lg text-gray-700 mb-4">
          You don’t have any courses yet!
        </p>
        <button className="create-button bg-[#ffc107] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800]">
          Create now
        </button>
      </div>
    </div>
  );
};

export default YourCourses;