"use client";

const ReviewAndSubmitForm = ({ formData, onSubmit, onPrevious }) => {
  const { courseDetails, videos } = formData;

  return (
    <div className="bg-[#f8f4eb] rounded-lg shadow-md p-6 mt-6 mx-auto max-w-4xl">
      <h3 className="text-xl font-semibold mb-4">Review and Submit</h3>

      {/* Course Details */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Course Details</h4>
        <p><strong>Title:</strong> {courseDetails.courseTitle}</p>
        <p><strong>Description:</strong> {courseDetails.description}</p>
        <p><strong>Category:</strong> {courseDetails.category}</p>
        <p><strong>Total Length:</strong> {courseDetails.totalLength} hours</p>
        <p><strong>Total Videos:</strong> {courseDetails.totalVideos}</p>
      </div>

      {/* Videos */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Videos</h4>
        {videos.map((video, index) => (
          <div key={index} className="mb-6">
            <h5 className="text-md font-semibold">Video {index + 1}: {video.title}</h5>
            <p><strong>File:</strong> {video.file?.name || "Not Uploaded"}</p>

            {video.timestamps.length > 0 ? (
              <div>
                <h6 className="font-semibold mt-2">Timestamps:</h6>
                <ul className="list-disc ml-6">
                  {video.timestamps.map((ts, tsIndex) => (
                    <li key={tsIndex} className="mb-2">
                      <strong>Time:</strong> {ts.time} | <strong>Quiz:</strong> {ts.quizQuestion}
                      <ul className="list-disc ml-6 mt-1">
                        {ts.quizOptions.map((option, optionIndex) => (
                          <li key={optionIndex} className={optionIndex === ts.correctOption ? "text-green-600" : ""}>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No timestamps added.</p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewAndSubmitForm;
