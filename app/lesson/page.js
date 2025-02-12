"use client"
import VideoPlayer from "@/components/video-player";
import { Divide } from "lucide-react";

export default function temp() {
  return (
    <div className="h-1/2 w-1/2">
      <VideoPlayer
        options={{
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          playbackRates: [0.5, 1, 1.5, 2, 2.5, 3],
          sources: [{ src: "/videos/hecker.mp4", type: "video/mp4" }],
        }}
      />
    </div>
  )
}