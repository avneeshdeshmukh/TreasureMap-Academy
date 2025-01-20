"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddVideos({ onAdd }) {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleAdd = () => {
    // video validation
    if (!videoFile || !videoTitle.trim()) {
      alert("Please provide a valid video title and file.");
      return;
    }

    const newVideo = {
      id: Date.now(), 
      title: videoTitle,
      file: {
        name: videoFile.name, 
        size: videoFile.size,
        type: videoFile.type,
      },
    };

    // Call the parent function to add the video
    onAdd(newVideo);

    
    setVideoTitle("");
    setVideoFile(null);

    
    document.getElementById("videoFileInput").value = "";
  };

  return (
    <div className="flex items-center gap-x-4">
      <input
        type="text"
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)}
        placeholder="Video Title"
        className="p-2 border rounded-md w-full"
      />

      <input
        id="videoFileInput"
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="p-2 border rounded-md"
      />

      <Button onClick={handleAdd} variant="plain">
        + Add Video
      </Button>
    </div>
  );
}