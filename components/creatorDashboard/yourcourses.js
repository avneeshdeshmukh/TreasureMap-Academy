"use client";
import Link from "next/link";

const YourCourses = ({ data }) => {

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const courses = data.courses;
  console.log(courses);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6 mx-auto max-w-3xl">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-[#5a3b1a]">Your Courses</h2>
      <button className="create-button bg-[#ffc107] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition-colors duration-200 w-full sm:w-auto">
        <Link href="/create/mycourses" className="flex items-center justify-center gap-2">
          <span>Create new</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </button>
    </div>
    
    <div className="courses-container bg-[#f8f4eb] border border-dashed border-[#d1c4a8] rounded-lg p-4 sm:p-6">
      {!isEmpty(courses) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Object.values(courses).map((course, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-[#5a3b1a] mb-2">{course.title}</h2>
              <div className="mt-auto pt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {course.enrollments} enrollments
                </span>
                <span className={`inline-flex items-center text-sm px-2 py-1 rounded ${
                  course.status === 'Published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    course.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                  {course.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600 mb-2">You have no published courses yet</p>
          <p className="text-gray-500 text-sm mb-6">Create your first course to get started</p>
          <button className="bg-[#ffc107] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#e0a800] transition-colors duration-200">
            <Link href="/create/mycourses" className="flex items-center gap-2">
              <span>Create your first course</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

export default YourCourses;