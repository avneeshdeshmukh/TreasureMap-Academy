const CourseCard = ({ course, onDelete, onEdit }) => {
    return (
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h4 className="text-lg font-semibold">{course.courseTitle}</h4>
        <p className="text-gray-600">{course.description}</p>
        {course.thumbnailURL && (
          <img
            src={course.thumbnailURL}
            alt="Course Thumbnail"
            className="w-full h-48 object-cover rounded mt-4"
          />
        )}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
            onClick={() => onEdit(course)}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };  
  
  export default CourseCard;
  