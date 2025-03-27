"use client";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button"
import { courseCategories, courseLanguages } from "@/lib/data";
import Select from "react-select";
import { getFirestore, getDoc, setDoc, doc, increment } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthProvider";
import { auth } from "@/lib/firebase";

const firestore = getFirestore();

const CourseForm = ({ closeForm, onCourseSubmit }) => {

  const { user } = useAuth();

  const [courseDetails, setCourseDetails] = useState({
    courseTitle: "",
    description: "",
    category: "",
    price: "",
    language: "",
    difficulty: "",
    thumbnail: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  //const router = useRouter();
  const fileInputRef = useRef(null);
  const courseId = uuidv4();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseDetails((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      setErrors((prev) => ({ ...prev, thumbnail: "" }));
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setCourseDetails((prev) => ({
      ...prev,
      category: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const getFileExtension = (mimeType) => {
    const mimeMapping = {
      "image/jpeg": "jpeg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      // Add more mappings as needed
    };
    return mimeMapping[mimeType] || "unknown";
  };


  const generateUploadUrl = async () => {
    if (!courseDetails.thumbnail) {
      setErrors({ thumbnail: "Please select a thumbnail file first." });
      return null;
    }

    try {
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/generateUploadUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          filepath: `${userData.username}/${courseId}/thumbnail.${getFileExtension(courseDetails.thumbnail.type)}`,
          contentType: courseDetails.thumbnail.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate upload URL");
      }

      const data = await response.json();
      return data.uploadUrl;
    } catch (err) {
      console.error("Error generating thumbnail upload URL:", err);
      setErrors({ thumbnail: "Error generating thumbnail upload URL." });
      return null;
    }
  };

  const uploadThumbnail = async (url) => {
    if (!url || !courseDetails.thumbnail) {
      setErrors({ thumbnail: "No thumbnail file selected or upload URL missing." });
      return false;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": courseDetails.thumbnail.type,
        },
        body: courseDetails.thumbnail,
      });

      if (response.ok) {
        return url.split("?")[0]; // Return the file URL (without query params)
      } else {
        throw new Error("Failed to upload thumbnail");
      }
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
      setErrors({ thumbnail: "Error uploading thumbnail." });
      return null;
    }
  };

  const handleSubmit = async () => {
    // Initialize error object
    const newErrors = {};
    if (!courseDetails.courseTitle) newErrors.courseTitle = "Course title is required.";
    if (!courseDetails.description) newErrors.description = "Description is required.";
    if (!courseDetails.category || courseDetails.category.length === 0)
      newErrors.category = "At least one category is required.";
    if (!courseDetails.difficulty) newErrors.difficulty = "Difficulty is required.";
    if (!courseDetails.thumbnail) newErrors.thumbnail = "Thumbnail is required.";
    if (!courseDetails.price || parseFloat(courseDetails.price) < 0) newErrors.price = "Please enter a valid price.";
    if (!courseDetails.language) newErrors.language = "Please select a language.";


    // Set errors if any and exit early
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Disable the submit button
    setIsSubmitting(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const thumbnailUrl = uploadUrl ? await uploadThumbnail(uploadUrl) : null;

      // if (!thumbnailUrl) {
      //   setErrors({ thumbnail: "Failed to upload thumbnail. Submission aborted." });
      //   return;
      // }

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      // Create a new course object
      const newCourse = {
        courseId,
        creator: userData.username,
        title: courseDetails.courseTitle,
        description: courseDetails.description,
        category: courseDetails.category,
        price: parseFloat(courseDetails.price),
        language: courseDetails.language,
        difficulty: courseDetails.difficulty,
        isPublished: false,
        totalVideos: 0,
        totalQuizzes: 0,
        thumbnailURL: `${userData.username}/${courseId}/thumbnail.${getFileExtension(courseDetails.thumbnail.type)}`,
      };

      const courseRef = doc(firestore, "courses", courseId);
      const courseProgressRef = doc(firestore, "courseProgress", user.uid);
      const courseProSnap = getDoc(courseProgressRef);
      if (courseProSnap.data()) {
        await updateDoc(courseProgressRef, {
          totalCourses : increment(1),
        }, {merge : true})
      } else {
        const progress = {
          userId : user.uid,
          username: userData.username,
          totalCourses: 1,
          publishedCourses: 0,
          totalRevenue: 0,
          averageRating: 0,
          totalEnrollments: 0,
        }

        await setDoc(courseProgressRef, progress);
      }
      await setDoc(courseRef, newCourse, { merge: true });

      // Call the onCourseSubmit function to propagate changes
      if (onCourseSubmit) {
        onCourseSubmit(newCourse);
      }

      // Reset form state
      setCourseDetails({
        courseTitle: "",
        description: "",
        category: "",
        difficulty: "",
        thumbnail: null,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear errors and enable submit button
      setErrors({});
      setIsSubmitting(false);

    }
    catch (err) {
      setError(`An error occured : ${err}`)
    }
  };


  // const handleDelete = (id) => {
  //   if (confirm("Are you sure you want to delete this course?")) {
  //     setSubmittedCourses((prevCourses) =>
  //       prevCourses.filter((course) => course.id !== id)
  //     );
  //   }
  // };

  // const handleEdit = (courseid) => {
  //     router.push(`/mycourses/${courseid}/edit-form`);
  //     console.log("edit button is working")
  // };


  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-6 mx-auto max-w-3xl relative">
      <button
        onClick={closeForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold"
      >
        &times;
      </button>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Create Course</h3>
      {error && <p>{error}</p>}

      {/* Course Title */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Course Title</label>
        <p className="text-sm text-slate-600 py-1">
          What would you like to name your course? Don't worry, you can change
          this later.
        </p>
        <input
          type="text"
          placeholder="Enter course title e.g Advanced Web Development"
          value={courseDetails.courseTitle}
          onChange={(e) =>
            setCourseDetails((prev) => ({
              ...prev,
              courseTitle: e.target.value,
            }))
          }
          className="border rounded-lg p-3 w-full focus:ring focus:ring-blue-300 focus:outline-none"
        />
        {errors.courseTitle && (
          <p className="text-red-500 text-sm">{errors.courseTitle}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Description</label>
        <textarea
          placeholder="Enter course description"
          value={courseDetails.description}
          onChange={(e) =>
            setCourseDetails((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="border rounded-lg p-3 w-full focus:ring focus:ring-blue-300 focus:outline-none"
          rows={4}
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Category</label>
        <Select
          isMulti
          options={courseCategories}
          value={courseCategories.filter((option) =>
            courseDetails.category?.includes(option.value)
          )}
          onChange={handleCategoryChange}
          placeholder="Select course categories..."
          className="w-full"
          styles={{
            control: (base) => ({
              ...base,
              border: "1px solid #d1d5db", // Matches the border style of other inputs
              borderRadius: "0.375rem",
              padding: "3px",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#a0aec0",
              },
            }),
          }}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Price (₹)</label>
        <input
          type="number"
          placeholder="Enter course price"
          value={courseDetails.price}
          onChange={(e) =>
            setCourseDetails((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
          className="border rounded-lg p-3 w-full focus:ring focus:ring-blue-300 focus:outline-none"
          min="0"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>

      {/* Language */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Language</label>
        <Select
          options={courseLanguages}
          value={courseLanguages.find((option) => option.value === courseDetails.language)}
          onChange={(selectedOption) =>
            setCourseDetails((prev) => ({
              ...prev,
              language: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="Select language..."
          className="w-full"
          styles={{
            control: (base) => ({
              ...base,
              border: "1px solid #d1d5db", // Matches the style of other inputs
              borderRadius: "0.375rem",
              padding: "3px",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#a0aec0",
              },
            }),
          }}
        />
        {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
      </div>


      {/* Difficulty */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Difficulty</label>
        <select
          value={courseDetails.difficulty}
          onChange={(e) =>
            setCourseDetails((prev) => ({
              ...prev,
              difficulty: e.target.value,
            }))
          }
          className="border rounded-lg p-3 w-full focus:ring focus:ring-blue-300 focus:outline-none"
        >
          <option value="" disabled>
            Select difficulty
          </option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        {errors.difficulty && (
          <p className="text-red-500 text-sm">{errors.difficulty}</p>
        )}
      </div>

      {/* Thumbnail */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleThumbnailChange}
          className="w-full"
        />
        {courseDetails.thumbnail && (
          <p className="text-green-600">
            Thumbnail uploaded: {courseDetails.thumbnail.name}
          </p>
        )}
        {errors.thumbnail && (
          <p className="text-red-500 text-sm">{errors.thumbnail}</p>
        )}

      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={closeForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {/* Submitted Courses */}
      {/* {submittedCourses.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Your Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {submittedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={() => handleDelete(course.id)}
                onEdit={() => handleEdit(course.id)}
              />
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CourseForm;