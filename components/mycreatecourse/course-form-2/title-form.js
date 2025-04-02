"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TitleForm = ({initialData}) => {
  const firestore = getFirestore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData);
  const [courseData, setCourseData] = useState(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
      return;
    }

    try {
      const courseRef = doc(firestore, "courses", courseId);

      // Update the difficulty field in Firestore
      await updateDoc(courseRef, { title });

      // Fetch the updated course data to reflect changes
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourseData(courseSnap.data());
      }

      setIsEditing(false); // Exit editing mode
       toast.success("Title updated successfully", {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                  });
    } catch (error) {
      console.error("Error updating title:", error);
       toast.error("Failed to update title", {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                  });
    }
  };

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(firestore, "courses", courseId);
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

  if (courseData) {
    return (
      <div className="mt-6 border bg-[#ffffff] shadow-md rounded-md p-4 sm:p-3">
        <div className="font-medium flex items-center justify-between flex-wrap gap-y-2">
          <span className="text-base sm:text-sm">Course Title</span>
          <Button onClick={toggleEdit} variant="plain" size="vsm">
            {isEditing ? "Cancel" : (
              <>
                <Pencil className="h-4 w-4 sm:h-3 sm:w-3 mr-2" />
                Edit Title
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <p className="text-sm mt-2 break-words">{courseData.title}</p>
        )}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 sm:mt-2">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 'Advanced Web Developer'"
                className="w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-x-2 flex-wrap">
              <Button type="submit" variant="ghost">Save</Button>
            </div>
          </form>
        )}
        <ToastContainer />
      </div>
    );
  }
};