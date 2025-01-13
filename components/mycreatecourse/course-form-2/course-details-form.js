"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import router for navigation

export default function CourseDetailsForm({ initialData, onNext }) {
  const [courseDetails, setCourseDetails] = useState(
    initialData || {
      category: "",
      totalLength: "",
    }
  );
  const [videos, setVideos] = useState([]); // Store the list of videos
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false); // Track if the video form is open
  const [currentVideo, setCurrentVideo] = useState({
    title: "",
    file: null,
  });
  const router = useRouter(); // Initialize the router

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setCurrentVideo((prev) => ({ ...prev, file: files[0] })); // Save file if uploaded
    } else {
      setCurrentVideo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVideo = () => {
    setIsVideoFormOpen(true); // Show the video form
  };

  const handleConfirmVideo = () => {
    if (!currentVideo.title || !currentVideo.file) {
      alert("Please provide a video title and upload a video file.");
      return;
    }

    const newVideo = { ...currentVideo, id: Date.now() }; // Generate a unique video ID
    setVideos((prev) => [...prev, newVideo]); // Add current video to the list
    setCurrentVideo({ title: "", file: null }); // Reset the video input form
    setIsVideoFormOpen(false); // Close the video form
  };

  const handleManageVideo = (videoId) => {
    // Redirect to the manage video page with the video ID
    router.push(`/edit-form/${videoId}/edit-video-details`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!courseDetails.category || !courseDetails.totalLength || videos.length === 0) {
      alert("Please fill out all fields and add at least one video.");
      return;
    }

    // Pass course details and videos to the next component
    onNext({ ...courseDetails, videos });
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4">Additional Course Details</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Course Category</label>
        <input
          type="text"
          name="category"
          value={courseDetails.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter course category (e.g., Technology, Business, Arts)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Course Length (in hours)</label>
        <input
          type="number"
          name="totalLength"
          value={courseDetails.totalLength}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter total course length (e.g., 5)"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Videos</h3>
        {videos.map((video, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-100">
            <h4 className="text-md font-semibold mb-2">{video.title}</h4>
            <p className="text-sm text-gray-700 mb-2">{video.file.name}</p>
            <button
              type="button"
              onClick={() => handleManageVideo(video.id)} // Navigate with video ID
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Manage Video
            </button>
          </div>
        ))}

        {isVideoFormOpen ? (
          <div className="mb-4 p-4 border rounded-lg bg-white shadow-md">
            <div className="mb-2">
              <input
                type="text"
                name="title"
                value={currentVideo.title}
                onChange={handleVideoInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Video Title"
              />
            </div>
            <div className="mb-2">
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleVideoInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleConfirmVideo}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setIsVideoFormOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddVideo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            + Add Video
          </button>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
