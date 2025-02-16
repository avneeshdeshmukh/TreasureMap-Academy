"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";

export default function AddVideos({ onAdd, numOfVideos }) {
  const firestore = getFirestore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(firestore, "courses", courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourseData(courseSnap.data());
        } else {
          console.log("No course found!");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData(); // Call the async function
  }, [courseId]);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const generateUploadUrl = async () => {
    if (!videoFile) {
      setStatus("Please select a video file first.");
      return null;
    }

    try {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/generateUploadUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          filepath: `${userData.username}/${courseData.courseId}/videos/${videoTitle}.mp4`,
          contentType: videoFile.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate upload URL");
      }

      const data = await response.json();
      setStatus("Upload URL generated successfully!");
      return { url: data.uploadUrl, userData }; // Return the URL instead of relying solely on state
    } catch (err) {
      console.error("Error generating upload URL:", err);
      setStatus("Error generating upload URL.");
      return null;
    }
  };

  const uploadFile = async (url) => {
    if (!url || !videoFile) {
      setStatus("No file selected or upload URL missing.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": videoFile.type,
        },
        body: videoFile,
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

  const handleAdd = async () => {

    if (!videoFile || !videoTitle.trim()) {
      alert("Please provide a valid video title and file.");
      return;
    }

    const { url, userData } = await generateUploadUrl(); // Get the URL directly
    if (url) {
      setUploadUrl(url); // Update state if needed for other components
      await uploadFile(url); // Pass the URL directly to uploadFile
    }

    const getVideoDuration = (file) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };

        video.onerror = (error) => {
          reject(error);
        };

        video.src = URL.createObjectURL(file);
      });
    };

    try {
      const duration = await getVideoDuration(videoFile); // Extract video duration

      const videoId = uuidv4();
      const videoRef = doc(firestore, "videos", videoId);

      const newVideo = {
        videoId,
        title: videoTitle,
        file: {
          name: videoFile.name,
          size: videoFile.size,
          type: videoFile.type,
        },
        videoURL: `${userData.username}/${courseData.courseId}/videos/${videoTitle}.mp4`,
        creator: userData.username,
        course: courseData.courseId,
        uploadedAt: new Date(),
        sequence: numOfVideos + 1,
        duration: Math.round(duration), // Store duration in seconds
      };

      await setDoc(videoRef, newVideo, { merge: true });

      setStatus("");
      onAdd(newVideo);

      setVideoTitle("");
      setVideoFile(null);
      document.getElementById("videoFileInput").value = "";
    } catch (error) {
      console.error("Error getting video duration:", error);
      setStatus("Error processing video duration.");
    }
  };

  return (
    <>

      <div>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="Video Title"
          className="p-2 border rounded-md w-full mb-2"
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
      {status && <p className="mt-2 text-center">{status}</p>}
    </>
  );
}