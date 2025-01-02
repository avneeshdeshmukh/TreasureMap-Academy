"use client";

const FeaturedCourses = () => {
  // Placeholder data for courses
  const courses = [
    { id: 1, title: "Course 1", description: "This is an example course." },
    { id: 2, title: "Course 2", description: "This is another course." },
    { id: 3, title: "Course 3", description: "Learn something new here." },
    { id: 4, title: "Course 4", description: "Explore more topics here." },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold text-[#5a3b1a] mb-4">Featured Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#f8f4eb] border border-gray-300 rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="h-32 bg-[#e9e4da] rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-[#5a3b1a]">{course.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCourses;
