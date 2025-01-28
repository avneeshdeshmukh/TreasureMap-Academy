"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

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
      alert("Title updated successfully!");
    } catch (error) {
      console.error("Error updating title:", error);
      alert("Failed to update title.");
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
      <div className="mt-6 border bg-[#ffffff] shadow-md rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          <span>Course Title</span>
          <Button onClick={toggleEdit} variant="plain" size="vsm">
            {isEditing ? "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Title
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <p className="text-sm mt-2">{courseData.title}</p>
        )}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 'Advanced Web Developer'"
              />
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" variant="ghost">Save</Button>
            </div>
          </form>
        )}
      </div>
    );
  }
};