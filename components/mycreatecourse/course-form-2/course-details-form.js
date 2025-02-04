"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IconBadge } from "@/components/ui/icons-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { DifficultyForm } from "./difficulty-form";
import AddVideos from "./add-video-form";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Edit3, Trash2 } from "lucide-react";
import { getFirestore, doc, getDoc, getDocs, collection, query, where, } from "firebase/firestore";

export default function VideoUploadForm({ onNext }) {
  const firestore = getFirestore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const courseRef = doc(firestore, "courses", courseId);

  const [videos, setVideos] = useState([]);
  const [courseData, setCourseData] = useState(null);


  const handleAddVideo = (video) => {
    setVideos((prev) => [...prev, video]);
  };

  const handleManageVideo = (videoId) => {
    router.push(
      `/create/courses/${courseId}/edit-form/${videoId}/edit-video-details`
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

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchCourseData = async () => {
      try {
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

  const fetchCourseVideos= async () => {
    try {
      const courseSnap = await getDoc(courseRef);
      const cd = courseSnap.data();

      // Reference the 'courses' collection
      const videosRef = collection(firestore, "videos");

      // Query courses where `username` matches the current user's username
      const q = query(videosRef, where("course", "==", cd.courseId));

      // Fetch the query snapshot
      const querySnapshot = await getDocs(q);

      // Extract course data
      const courseVideos = querySnapshot.docs.map((doc) => doc.data());
      return courseVideos; // Return the array of courses
    } catch (error) {
      console.error("Error fetching course videos:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const courseVideos = await fetchCourseVideos();
        setVideos(courseVideos); // State update triggers re-render
      } catch (err) {
        setError(err.message);
      }
    };
  
    loadVideos();
  }, []); // No dependency needed
  


  if (courseData) {

    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold mb-2">Course Setup</h1>

        <div className="grid md:grid-cols-1 gap-8">
          {/* Left Section: Course Customization */}
          <div className="">
            <div className="flex items-center gap-x-3 mb-4">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-medium">Customize Your Course</h2>
            </div>
            <div className="space-y-4">
              <TitleForm initialData={courseData.title} />
              <DescriptionForm initialData={courseData.description} />
              <DifficultyForm initialData={courseData.difficulty} />
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
                        onClick={() => handleManageVideo(video.videoId)}
                      >
                        <Edit3 size={16} />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-x-1"
                        onClick={() => handleDeleteVideo(video.videoId)}
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
            
          </div>
        </div>
      </div>
    );
  }
}
