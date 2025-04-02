"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LanguageForm = ({initialData}) => {
  const firestore = getFirestore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState(initialData);
  const [courseData, setCourseData] = useState(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!language.trim()) {
      toast.error("language cannot be empty", {
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
      await updateDoc(courseRef, { language });

      // Fetch the updated course data to reflect changes
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourseData(courseSnap.data());
      }

      setIsEditing(false); // Exit editing mode
      if (!price.trim()) {
        toast.success("Language updated successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
        return;
      }
    } catch (error) {
      console.error("Error updating language:", error);
      if (!price.trim()) {
        toast.error("Failed to update language", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
        return;
      }
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
          console.log(courseSnap.data());
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
          <span>Course language</span>
          <Button onClick={toggleEdit} variant="plain" size="vsm">
            {isEditing ? "Cancel" : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit language
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <p className="text-sm mt-2">{courseData.language[0].toUpperCase()}{courseData.language.substring(1)}</p>
        )}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="" disabled>
                  Select Language
                </option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Marathi">Marathi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" variant="ghost">Save</Button>
            </div>
          </form>
        )}
        <ToastContainer/>
      </div>
    );
  }
};