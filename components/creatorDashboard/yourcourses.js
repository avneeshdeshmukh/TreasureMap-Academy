"use client";
import Link from "next/link";

const YourCourses = ({ data }) => {

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const courses = data.courses;
  console.log(isEmpty(courses));
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl px-4">
      <div className="flex justify-between">
      <h2 className="text-2xl font-bold text-[#5a3b1a] mb-4">Your Courses</h2>
      <button className="create-button bg-[#ffc107] h-10 text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800]">
          <Link href="/create/mycourses">
            Create new
          </Link>
        </button>
      </div>
      <div className="courses-container bg-[#f8f4eb] flex flex-col items-center justify-center border border-dashed border-[#d1c4a8] rounded-lg py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {!isEmpty(courses) ? (
            Object.values(courses).map((course) => (
              <div key={course.courseId} className="bg-[#f8f4eb] p-4 bg-white ms-5 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-[#5a3b1a]">{course.title}</h2>
                <p className="text-gray-500 ">Enrollments: {course.enrollments}</p>
                <p className="text-gray-500 ">Status: {course.status}</p>
              </div>
            ))
          ) : (

            <p className="text-center">You have no published courses...</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default YourCourses;