'use client'
import { useParams } from "next/navigation";
import VideoQuiz from "@/components/video-quiz";

export default function LessonPage() {
    const {courseId, videoId} = useParams();
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <VideoQuiz courseId={courseId} videoId={videoId} />
        </div>
    )
}
