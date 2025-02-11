'use client'
import { useParams } from "next/navigation";
import VideoQuiz from "@/components/video-quiz";

export default function LessonPage() {
    const {courseId, videoId} = useParams();
    return(
        <VideoQuiz courseId={courseId} videoId={videoId} />
    )
}
