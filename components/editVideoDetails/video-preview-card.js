"use client"
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player"; 
import VideoQuiz from "@/components/video-quiz";

export default function VideoPreviewCard({ videoData}) {
    const [open, setOpen] = useState(false);

   
    return (
        <div>
            <Card className="flex items-center justify-between p-4 w-1/3">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        🎬
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{videoData.title}</p>
                        <p className="text-xs text-gray-800">Preview</p>
                    </div>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-10 h-8" onClick={() => setOpen(true)}>
                            <ArrowUpRight className="h-7" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl"> {/* Ensures the modal is wide enough */}
                        <DialogHeader>
                            <DialogTitle>Video Preview</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 flex justify-center">
                            <VideoQuiz courseId={videoData.course} videoId={videoData.videoId}/>
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}