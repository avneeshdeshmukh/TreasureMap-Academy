"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddVideos({ onAdd, numOfVideos, fetchVideos }) {
  const firestore = getFirestore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // New state for upload progress

  useEffect(() => {
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

    fetchCourseData();
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
      setStatus("");
      return { url: data.uploadUrl, userData };
    } catch (err) {
      console.error("Error generating upload URL:", err);
      setStatus("Error generating upload URL.");
      return null;
    }
  };

  const uploadFile = async (url, newVideo) => {
    if (!url || !videoFile) {
      setStatus("No file selected or upload URL missing.");
      return;
    }

    try {
      setIsUploading(true); // Set upload to true when starting

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", videoFile.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          setStatus("File uploaded successfully!");
          setUploadProgress(0);

          // Hide the status message after 2 seconds
          setTimeout(() => {
            setStatus("");
          }, 2000);

          // Only add video after upload is complete
          onAdd(newVideo);

          // Reset input fields
          setVideoTitle("");
          setVideoFile(null);
          document.getElementById("videoFileInput").value = "";
        } else {
          setStatus("Error uploading file.");
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        setStatus("Error uploading file.");
        setIsUploading(false); // Set upload to false on error
      };

      xhr.send(videoFile);
    } catch (err) {
      console.error("Error uploading file:", err);
      setStatus("Error uploading file.");
      setIsUploading(false); // Set upload to false on error
    }
  };

  const handleAdd = async () => {
    if (!videoFile || !videoTitle.trim()) {
      toast.error("Please provide a valid video title and file", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
      return;
    }

    const { url, userData } = await generateUploadUrl();
    if (!url) return;

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
      const duration = await getVideoDuration(videoFile);

      const videoId = uuidv4();
      const videoRef = doc(firestore, "videos", videoId);
      const courseRef = doc(firestore, "courses", courseId);
      const videoInteractionRef = doc(firestore, "videoInteraction", videoId);

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
        duration: Math.round(duration),
      };

      const newVI = {
        videoId,
        courseId : courseData.courseId,
        likes: 0,
        dislikes: 0,
        comments: [],
      };

      await setDoc(videoRef, newVideo, { merge: true });
      await setDoc(videoInteractionRef, newVI, { merge: true });
      await updateDoc(courseRef, {
        totalVideos : increment(1),
        courseDuration : increment(Math.round(duration)),
      }, {merge : true })

      setStatus("");

      await uploadFile(url, newVideo);

      fetchVideos();
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

        <Button
          as={motion.button}
          onClick={handleAdd}
          variant="plain"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed ml-4"
          whilehover={{ scale: 1.05 }}
          whiletap={{ scale: 0.95 }}
          disabled={isUploading || !videoTitle.trim() || !videoFile}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4 ">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        {uploadProgress > 0 && (
          <div className="mt-2 text-center">{uploadProgress}%</div>
        )}
      </div>
      {status && <p className="mt-2 text-center">{status}</p>}
      <ToastContainer/>
    </>
  );
}
