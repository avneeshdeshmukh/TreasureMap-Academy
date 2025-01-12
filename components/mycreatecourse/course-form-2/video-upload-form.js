"use client";

import { useState } from "react";

const VideoUploadForm = ({ totalVideos, initialData = [], onNext, onPrevious }) => {
  const [videos, setVideos] = useState(initialData); // Store all videos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoDetails, setVideoDetails] = useState(
    initialData[0] || { title: "", file: null, timestamps: [] }
  );
  const [timestampDetails, setTimestampDetails] = useState({
    time: "",
    quizQuestion: "",
    quizOptions: ["", "", "", ""],
    correctOption: 0,
  });
  const [editingTimestampIndex, setEditingTimestampIndex] = useState(null);

  const handleAddOrUpdateTimestamp = () => {
    if (!timestampDetails.time || !timestampDetails.quizQuestion) {
      alert("Please fill in all timestamp fields.");
      return;
    }

    const updatedTimestamps = [...videoDetails.timestamps];
    if (editingTimestampIndex !== null) {
      // Update an existing timestamp
      updatedTimestamps[editingTimestampIndex] = timestampDetails;
    } else {
      // Add a new timestamp
      updatedTimestamps.push(timestampDetails);
    }

    setVideoDetails((prev) => ({
      ...prev,
      timestamps: updatedTimestamps,
    }));

    setTimestampDetails({
      time: "",
      quizQuestion: "",
      quizOptions: ["", "", "", ""],
      correctOption: 0,
    });
    setEditingTimestampIndex(null); // Reset editing index
  };

  const handleEditTimestamp = (index) => {
    const selectedTimestamp = videoDetails.timestamps[index];
    setTimestampDetails(selectedTimestamp); // Populate form with the selected timestamp
    setEditingTimestampIndex(index); // Set the index to track which timestamp is being edited
  };

  const handleDeleteTimestamp = (index) => {
    const updatedTimestamps = videoDetails.timestamps.filter((_, i) => i !== index);
    setVideoDetails((prev) => ({ ...prev, timestamps: updatedTimestamps }));
  };

  const saveCurrentVideo = () => {
    setVideos((prev) => {
      const updatedVideos = [...prev];
      updatedVideos[currentVideoIndex] = videoDetails; // Save the current video details
      return updatedVideos;
    });
  };

  const handleNextVideo = () => {
    if (!videoDetails.title || !videoDetails.file) {
      alert("Please provide a title and upload a video.");
      return;
    }

    saveCurrentVideo();

    if (currentVideoIndex + 1 < totalVideos) {
      const nextVideo = videos[currentVideoIndex + 1] || {
        title: "",
        file: null,
        timestamps: [],
      };
      setVideoDetails(nextVideo);
      setCurrentVideoIndex((prev) => prev + 1);
    } else {
      onNext(videos);
    }
  };

  const handlePreviousVideo = () => {
    saveCurrentVideo();
  
    if (currentVideoIndex > 0) {
      const previousVideo = videos[currentVideoIndex - 1] || {
        title: "",
        file: null,
        timestamps: [],
      };
      setVideoDetails(previousVideo);
      setTimestampDetails({
        time: "",
        quizQuestion: "",
        quizOptions: ["", "", "", ""],
        correctOption: 0,
      }); // Reset the timestamp form
      setEditingTimestampIndex(null); // Reset editing index
      setCurrentVideoIndex((prev) => prev - 1);
    } else {
      onPrevious(); // Navigate to the previous form page
    }
  };

  return (
    <div className="bg-[#f8f4eb] rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl">
      <h3 className="text-xl font-semibold mb-4">
        Video Upload ({currentVideoIndex + 1}/{totalVideos})
      </h3>

      <input
        type="text"
        placeholder="Video Title"
        value={videoDetails.title}
        onChange={(e) =>
          setVideoDetails((prev) => ({ ...prev, title: e.target.value }))
        }
        className="border rounded p-2 mb-4 w-full"
      />

      <input
        type="file"
        accept="video/*"
        onChange={(e) =>
          setVideoDetails((prev) => ({ ...prev, file: e.target.files[0] }))
        }
        className="mb-4"
      />
      {videoDetails.file && (
        <p className="text-green-600">Video uploaded: {videoDetails.file.name}</p>
      )}

      <h4 className="text-lg font-semibold mt-6">Timestamps</h4>
      <div className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Timestamp (e.g., 00:05:30)"
          value={timestampDetails.time}
          onChange={(e) =>
            setTimestampDetails((prev) => ({ ...prev, time: e.target.value }))
          }
          className="border rounded p-2 w-1/3"
        />
        <input
          type="text"
          placeholder="Quiz Question"
          value={timestampDetails.quizQuestion}
          onChange={(e) =>
            setTimestampDetails((prev) => ({
              ...prev,
              quizQuestion: e.target.value,
            }))
          }
          className="border rounded p-2 w-2/3"
        />
      </div>

      {timestampDetails.quizOptions.map((option, index) => (
        <div className="flex gap-4 items-center mb-2" key={index}>
          <input
            type="radio"
            name="correctOption"
            checked={timestampDetails.correctOption === index}
            onChange={() =>
              setTimestampDetails((prev) => ({ ...prev, correctOption: index }))
            }
          />
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const updatedOptions = [...timestampDetails.quizOptions];
              updatedOptions[index] = e.target.value;
              setTimestampDetails((prev) => ({
                ...prev,
                quizOptions: updatedOptions,
              }));
            }}
            className="border rounded p-2 w-full"
          />
        </div>
      ))}

      <button
        onClick={handleAddOrUpdateTimestamp}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        {editingTimestampIndex !== null ? "Update Timestamp" : "Add Timestamp"}
      </button>

      {videoDetails.timestamps.length > 0 && (
        <div className="mt-4">
          <h5 className="text-md font-semibold">Added Timestamps:</h5>
          <div className="flex flex-wrap gap-2">
            {videoDetails.timestamps.map((ts, index) => (
              <button
                key={index}
                onClick={() => handleEditTimestamp(index)}
                className="px-4 py-2 bg-blue-300 text-black rounded"
              >
                {ts.time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousVideo}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNextVideo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {currentVideoIndex + 1 < totalVideos ? "Next Video" : "Complete"}
        </button>
      </div>
    </div>
  );
};

export default VideoUploadForm;