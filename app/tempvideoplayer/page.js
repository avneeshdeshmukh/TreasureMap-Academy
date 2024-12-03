"use client"
import VideoPlayer from "@/components/tempvideoplayer/VideoPlayer";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen p-8 bg-gray-100">
            <div className="container mx-auto">
                <div className="no-underline appearance-none learnerButtons bg-blue-950 w-fit h-12 text-white rounded-2xl text-center text-md hover:bg-blue-600 p-4 flex justify-center items-center">
            <Link href={'/learn'}>
                <button className="text-white ">Back to the Dashboard</button>
              </Link>
              </div>
                <VideoPlayer />
            </div>
        </main>
    );
}

//add buffer progress indication and also show the upcoming quiz  on the progress bar
//add keyboard controls for seeking, make the progress bar draggable