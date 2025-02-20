"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IconBadge } from "@/components/ui/icons-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { DifficultyForm } from "./difficulty-form";
import AddVideos from "./add-video-form";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Edit3, Trash2, Edit } from "lucide-react";
import { getFirestore, doc, getDoc, getDocs, collection, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LanguageForm } from "./language-form";
import { PriceForm } from "./price-form";

export default function VideoUploadForm({ onNext }) {
  const firestore = getFirestore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const courseRef = doc(firestore, "courses", courseId);

  const [videos, setVideos] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalVideos, setOriginalVideos] = useState([]);
  const [numOfVideos, setNumOfVideos] = useState(0);

  const handleAddVideo = (video) => {
    setVideos((prev) => [...prev, video]);
    setOriginalVideos((prev) => [...prev, video]);
  };

  const handleManageVideo = (videoId) => {
    router.push(
      `/create/courses/${courseId}/edit-form/${videoId}/edit-video-details`
    );
  };

  const generateDeleteUrl = async (filepath) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/deleteVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ filepath }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate delete URL");
      }

      const data = await response.json();
      return data.deleteUrl;
    } catch (err) {
      console.error("Error generating delete URL:", err);
      return null;
    }
  };

  const deleteFile = async (url) => {
    if (!url) {
      return;
    }

    try {
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      return response;
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const videoRef = doc(firestore, "videos", videoId);
    const videoSnap = await getDoc(videoRef);
    const filepath = videoSnap.data().videoURL;

    const deleteURL = await generateDeleteUrl(filepath);

    if (deleteURL) {
      const isConfirmed = window.confirm("Are you sure you want to delete this video?");
      if (!isConfirmed) return;

      const response = await deleteFile(deleteURL);
      if (response.ok) {
        await deleteDoc(videoRef);
        setVideos((prev) => prev.filter((video) => video.videoId !== videoId));
        setOriginalVideos((prev) => prev.filter((video) => video.videoId !== videoId));
      }
    }
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

  const fetchCourseVideos = async () => {
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
      courseVideos.sort((a, b) => a.sequence - b.sequence);
      setNumOfVideos(courseVideos.length);
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
        setOriginalVideos(courseVideos);
      } catch (err) {
        setError(err.message);
      }
    };

    loadVideos();
  }, []); // No dependency needed

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedVideos = [...videos];
    const [movedItem] = reorderedVideos.splice(result.source.index, 1);
    reorderedVideos.splice(result.destination.index, 0, movedItem);

    setVideos(reorderedVideos);
  };

  const handleUpdateOrder = async () => {
    try {
      const batchUpdates = videos.map((video, index) =>
        updateDoc(doc(firestore, "videos", video.videoId), { sequence: index + 1 })
      );

      await Promise.all(batchUpdates);
      setIsEditing(false);
      alert("Video order updated!");
    } catch (error) {
      console.error("Error updating video order:", error);
    }
  };

  const handleCancelEdit = () => {
    setVideos(originalVideos);
    setIsEditing(false);
  };

  const handleEditButton = () => {
    setVideos(originalVideos);
    setIsEditing(!isEditing);
  };



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
              <LanguageForm initialData={courseData.language} />
              <PriceForm initialData={courseData.price} />
            </div>
          </div>

          {/* Right Section: Course Videos */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Course Videos</h2>
              {/* Pass the handleAddVideo function to AddVideos */}
              <AddVideos onAdd={handleAddVideo} numOfVideos={numOfVideos} />
            </div>
            <div className="w-full flex">
              <Button
                size="sm"
                className="flex items-center gap-x-1"
                onClick={handleEditButton}
              >
                <Edit size={16} />
                {isEditing ? "Cancel" : "Edit Order"}
              </Button>
            </div>


            {isEditing && (
              <p className="text-sm text-gray-500">Drag and drop videos to reorder, then click "Update".</p>
            )}
            {/* Use DragDropContext to wrap the videos list */}
            {videos.length > 0 ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="videosList" isDropDisabled={!isEditing}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="divide-y divide-gray-200"
                    >
                      {videos.map((video, index) => (
                        <Draggable key={video.videoId} draggableId={video.videoId} index={index} isDragDisabled={!isEditing}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between py-3"
                            >
                              <div>{/* Serial number */}
                                <h4 className="font-medium text-gray-800">{index + 1}. {video.title}</h4>
                                <p className="text-sm text-gray-500">{video.file.name}</p>
                              </div>
                              {!isEditing && (
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
                              )}
                            </div>

                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {isEditing && (

                        <div className="w-full flex justify-end">
                          <Button variant="danger"
                            size="sm"
                            className="mt-4 mr-2"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>

                          <Button variant="ghost"
                            size="sm"
                            className="mt-4 text-yellow-600"
                            onClick={handleUpdateOrder}
                          >
                            Update Sequence
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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