"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase"; 

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const generateUploadUrl = async () => {
    if (!file) {
      setStatus("Please select a video file first.");
      return;
    }

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/generateUploadUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          filepath: `Course1/${file.name}`, 
          contentType: file.type, 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate upload URL");
      }

      const data = await response.json();
      setUploadUrl(data.uploadUrl);
      setStatus("Upload URL generated successfully!");
    } catch (err) {
      console.error("Error generating upload URL:", err);
      setStatus("Error generating upload URL.");
    }
  };

  const uploadFile = async () => {
    if (!uploadUrl || !file) {
      setStatus("No file selected or upload URL missing.");
      return;
    }

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (response.ok) {
        setStatus("File uploaded successfully!");
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setStatus("Error uploading file.");
    }
  };

  const handleUpload = async () => {
    await generateUploadUrl();
    await uploadFile();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept="video/*"
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Upload Video
      </button>
      {status && <p className="mt-2 text-center">{status}</p>}
    </div>
  );
};

export default UploadVideo;
