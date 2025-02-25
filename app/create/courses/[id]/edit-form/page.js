"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseDetailsForm from "@/components/mycreatecourse/course-form-2/course-details-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DeleteModal from "@/components/mycreatecourse/course-form-2/DeleteModal";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, collection, query, where, getDocs, deleteDoc, getDoc } from "firebase/firestore";

export default function EditFormPage() {
  const firestore = getFirestore();

  const router = useRouter();
  const { id } = useParams();
  const courseRef = doc(firestore, "courses", id);

  const [course, setCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle the submit logic
  const handlePublish = () => {
    console.log("Form Data Submitted:", formData);
    alert("Form submitted successfully!");
  };

  // Handle going back
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  useEffect(() => {
    const getCourse = async () => {
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse(courseSnap.data());
        console.log(courseSnap.data());
      }
    }
    getCourse();
  }, [id])

  const deleteVideos = async () => {
    if (!id) return;

    try {
      const videosRef = collection(firestore, "videos");
      const q = query(videosRef, where("course", "==", id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No videos found for this course.");
        return;
      }

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      console.log(`Deleted ${snapshot.size} videos.`);
    } catch (error) {
      console.error("Error deleting videos:", error);
    }
  };

  const deleteDraft = async () => {
    if (!id) return;

    const idToken = await auth.currentUser.getIdToken();

    try {

      const response = await fetch("/api/deleteCourse", {
        method: "POST",
        body: JSON.stringify({ folderPath: `${course.creator}/${id}` }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting folder:", error);
      console.log("Failed to delete folder.");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      // Step 1: Delete course from S3
      const deleteResponse = await deleteDraft();
      console.log(deleteResponse.success);

      if (deleteResponse && deleteResponse.message) {
        console.log("S3 Deletion Successful");

        // Step 2: Delete associated videos from Firestore
        await deleteVideos();

        // Step 3: Delete the course document from Firestore
        await deleteDoc(courseRef);

        console.log("Course and associated videos deleted from Firestore.");

        // Step 4: Redirect to courses list or another page after deletion
        router.push("/create/mycourses");
      } else {
        console.error("S3 Deletion Failed:", deleteResponse?.error);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }

    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ">Edit Course</h1>
        <div className="p-2 rounded-full hover:bg-red-500 transition"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="cursor-pointer text-gray-700" />
        </div>
      </div>
      {/* Course Details Form */}
      <CourseDetailsForm />

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
          onClick={handleBack}
        >
          Back
        </button>
        <Button onClick={handlePublish} variant="ghost">
          Publish Course
        </Button>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
