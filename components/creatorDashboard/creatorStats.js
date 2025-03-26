"use client";

const Statistics = ({data}) => {
  
  const stats = [
    { title: "Courses Created", value: data.totalCourses },
    { title: "Courses Published", value: data.publishedCourses },
    { title: "Total Enrollments", value: data.totalEnrollments },
    { title: "Average Content Rating", value: data.averageRating },
  ];

  console.log(stats);
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center border border-gray-300 rounded-lg p-4 bg-[#f8f4eb]"
          >
            <h3 className="text-lg font-semibold text-[#5a3b1a] mb-2">
              {stat.title}
            </h3>
            <div className="text-4xl font-bold text-[#5a3b1a]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
