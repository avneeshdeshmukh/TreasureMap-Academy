"use client"

import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

export default function ProgressUpdate({ children }) {
    const firestore = getFirestore();

    useEffect(() => {
        const updateDB = async () => {
            const progress = localStorage.getItem("progress");

            if (!progress) return;

            try {
                const parsedProgress = JSON.parse(progress);
                const videoNotesRef = doc(firestore, "videoNotes", `${parsedProgress.videoId}_${parsedProgress.userId}`);

                await updateDoc(videoNotesRef, {
                    lastProgressTime: parsedProgress.timestamp,
                }, { merge: true })
            } catch (error) {
                console.error(error);
            }

            localStorage.removeItem("progress");
        }

        updateDB();
    }, [])

    return (
        <>{children}</>
    )

}