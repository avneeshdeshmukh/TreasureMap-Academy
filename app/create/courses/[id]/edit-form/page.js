"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseDetailsForm from "@/components/mycreatecourse/course-form-2/course-details-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DeleteModal from "@/components/mycreatecourse/course-form-2/DeleteModal";
import { auth } from "@/lib/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFirestore, doc, collection, query, where, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function EditFormPage() {
  const firestore = getFirestore();
  const userId = auth.currentUser.uid;

  const router = useRouter();
  const { id } = useParams();
  const courseRef = doc(firestore, "courses", id);

  const [course, setCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const checkQuizzes = async () => {
    const videosRef = collection(firestore, "videos");
    const q = query(videosRef, where("course", "==", id));

    try {
      const querySnapshot = await getDocs(q);
      const videoList = querySnapshot.docs.map(doc => ({
        videoId: doc.data().videoId,
        ...doc.data(),
      }));

      let allHaveQuizzes = true;

      for (let i = 0; i < videoList.length; i++) {
        if (videoList[i].quizzes === null || isEmpty(videoList[i].quizzes)) {
          allHaveQuizzes = false;
          return;
        }
      }

      return allHaveQuizzes;
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }
  const getCourse = async () => {
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      setCourse(courseSnap.data());
    }
  }

  // Handle the submit logic
  const handlePublish = async () => {
    let updatedCourse=null;
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      updatedCourse = courseSnap.data()
      setCourse(courseSnap.data());
    }
    if (updatedCourse.totalVideos < 10) {
      alert(`The course must have at least 10 lessons. Currently there are ${updatedCourse.totalVideos}`);
      // toast.error(`The course must have at least 10 lessons. Currently there are ${updatedCourse.totalVideos}`, {
      //   position: "bottom-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      return;
    }

    const quizzesPresent = await checkQuizzes();

    if (!quizzesPresent) {
      toast.error(`Please add at least one quiz in each video`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setShowTermsModal(true);
  };

  const handlePublishAfterTerms = async () => {
    const courseProgressRef = doc(firestore, "courseProgress", userId);
    const courseProgressSnap = await getDoc(courseProgressRef);
    const data = courseProgressSnap.data();

    if (Object.keys(data.courses).includes(id)) {
      await updateDoc(courseProgressRef, {
        [`courses.${id}.status`]: "verification",
      })
      toast.success('Course sent for verification', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
      setShowTermsModal(false);
      router.push("/create/mycourses");
      return;
    }

    const progress = {
      courseId: id,
      title: course.title,
      creator: course.creator,
      status: "verification",
      enrollments: 0,
      revenue: 0,
      ratings: 0,
      comments: [],
    }

    await updateDoc(courseProgressRef, {
      [`courses.${id}`]: progress,
    }, { merge: true })

    alert("Course sent for verification successfully");
    setShowTermsModal(false);
    router.push("/create/mycourses");
  };

  // Handle going back
  const handleBack = () => {
    router.push(`/create/mycourses`); // Navigate to the previous page
  };

  useEffect(() => {
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
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-auto">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <div className="h-64 overflow-y-auto border p-4 mb-4 text-sm">
              <h3 className="font-semibold mb-2">1. Content Guidelines</h3>
              <p className="mb-3">
                By publishing this course, you confirm that all content is original or properly licensed for use. You agree not to publish any content that infringes on intellectual property rights, contains offensive material, or violates our community guidelines.
              </p>
              <h3 className="font-semibold mb-2">2. Revenue Sharing</h3>
              <p className="mb-3">
                You understand that revenue generated from your course will be shared according to our current revenue split policy, which may be updated from time to time.
              </p>
              <h3 className="font-semibold mb-2">3. Quality Standards</h3>
              <p className="mb-3">
                You agree to maintain a certain level of quality and respond to student inquiries in a timely manner. Courses that consistently receive poor ratings may be subject to review.
              </p>
              <h3 className="font-semibold mb-2">4. Distribution Rights</h3>
              <p className="mb-3">
                By publishing your course, you grant us non-exclusive rights to market and distribute your content across our platform and affiliated channels.
              </p>
              <h3 className="font-semibold mb-2">5. Modification</h3>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the platform after such modifications constitutes your consent to the updated terms.
              </p>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="agreeTerms"
                className="mr-2"
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
              />
              <label htmlFor="agreeTerms" className="text-sm">I agree to the terms and conditions</label>
            </div>


            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTermsModal(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handlePublishAfterTerms}
                disabled={!termsAgreed}
                className={!termsAgreed ? "opacity-50 cursor-not-allowed" : ""}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>

  );
}