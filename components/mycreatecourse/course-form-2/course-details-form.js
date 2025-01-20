"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IconBadge } from "@/components/ui/icons-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { DifficultyForm } from "./difficulty-form";
import AddVideos from "./add-video-form";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Edit3, Trash2 } from "lucide-react";


export default function VideoUploadForm({ onNext }) {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [videos, setVideos] = useState([]);

  const handleAddVideo = (video) => {
    setVideos((prev) => [...prev, video]);
  };

  const handleManageVideo = (videoId) => {
    router.push(
      `/mycourses/${courseId}/edit-form/${videoId}/edit-video-details`
    );
  };

  const handleDeleteVideo = (videoId) => {
    setVideos((prev) => prev.filter((video) => video.id !== videoId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videos.length === 0) {
      alert("Please add at least one video.");
      return;
    }
    console.log("Upload to AWS")
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <h1 className="text-3xl font-semibold mb-2">Course Setup</h1>
      <span className="text-sm text-gray-600">Complete all fields (2/5)</span>

      <div className="grid md:grid-cols-1 gap-8">
        {/* Left Section: Course Customization */}
        <div className="">
          <div className="flex items-center gap-x-3 mb-4">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-medium">Customize Your Course</h2>
          </div>
          <div className="space-y-4">
            <TitleForm />
            <DescriptionForm />
            <DifficultyForm />
          </div>
        </div>

        {/* Right Section: Course Videos */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Course Videos</h2>
            {/* Pass the handleAddVideo function to AddVideos */}
            <AddVideos onAdd={handleAddVideo} />
          </div>

          {videos.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{video.title}</h4>
                    <p className="text-sm text-gray-500">{video.file.name}</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-x-1"
                      onClick={() => handleManageVideo(courseId, video.id)}
                    >
                      <Edit3 size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-x-1"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              No videos added yet. Click "Add Video" to get started.
            </p>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              variant="ghost"
            >
              Submit Videos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
