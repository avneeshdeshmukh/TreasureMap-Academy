"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuth } from "../context/AuthProvider";

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
            return null; // Return null if no file is selected
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
            setStatus("Upload URL generated successfully!");
            return data.uploadUrl; // Return the URL instead of relying solely on state
        } catch (err) {
            console.error("Error generating upload URL:", err);
            setStatus("Error generating upload URL.");
            return null;
        }
    };


    const uploadFile = async (url) => {
        if (!url || !file) {
            setStatus("No file selected or upload URL missing.");
            return;
        }

        try {
            const response = await fetch(url, {
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
        const url = await generateUploadUrl(); // Get the URL directly
        if (url) {
            setUploadUrl(url); // Update state if needed for other components
            await uploadFile(url); // Pass the URL directly to uploadFile
        }
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