"use client";
import React from "react";

const Drafts = ({ courses = [], onDelete, onEdit }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Course Drafts
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No draft courses yet. Create your first course above!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Course Drafts</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            {courses.length} {courses.length === 1 ? "Draft" : "Drafts"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {course.courseTitle}
                </h3>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => onEdit(course.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drafts;