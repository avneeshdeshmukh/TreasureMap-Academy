"use client";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { courseCategories, courseLanguages } from "@/lib/data";
import Select from "react-select";
import { getFirestore, getDoc, setDoc, doc, increment, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthProvider";
import { auth } from "@/lib/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const courseId = uuidv4();

  // Handle thumbnail file selection
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

  // Handle category selection
  const handleCategoryChange = (selectedOptions) => {
    setCourseDetails((prev) => ({
      ...prev,
      category: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  // Get file extension from MIME type
  const getFileExtension = (mimeType) => {
    const mimeMapping = {
      "image/jpeg": "jpeg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    return mimeMapping[mimeType] || "unknown";
  };

  // Generate upload URL for Firebase Storage
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

  // Upload thumbnail with progress tracking
  const uploadThumbnail = async (url) => {
    if (!url || !courseDetails.thumbnail) {
      setErrors({ thumbnail: "No thumbnail file selected or upload URL missing." });
      return null;
    }

    try {
      setUploadProgress(0); // Reset progress before upload
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", courseDetails.thumbnail.type);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      return new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(url.split("?")[0]);
          } else {
            reject(new Error("Failed to upload thumbnail"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Error uploading thumbnail"));
        };

        xhr.send(courseDetails.thumbnail);
      });
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
      setErrors({ thumbnail: "Error uploading thumbnail." });
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = {};
    if (!courseDetails.courseTitle) newErrors.courseTitle = "Course title is required.";
    if (!courseDetails.description) newErrors.description = "Description is required.";
    if (!courseDetails.category || courseDetails.category.length === 0)
      newErrors.category = "At least one category is required.";
    if (!courseDetails.difficulty) newErrors.difficulty = "Difficulty is required.";
    if (!courseDetails.thumbnail) newErrors.thumbnail = "Thumbnail is required.";
    if (!courseDetails.price || parseFloat(courseDetails.price) < 0)
      newErrors.price = "Please enter a valid price.";
    if (!courseDetails.language) newErrors.language = "Please select a language.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const thumbnailUrl = uploadUrl ? await uploadThumbnail(uploadUrl) : null;

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const newCourse = {
        courseId,
        creatorId: user.uid,
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
        thumbnailURL: thumbnailUrl
          ? `${userData.username}/${courseId}/thumbnail.${getFileExtension(courseDetails.thumbnail.type)}`
          : null,
      };

      const courseRef = doc(firestore, "courses", courseId);
      const courseProgressRef = doc(firestore, "courseProgress", user.uid);
      await updateDoc(courseProgressRef, {
        totalCourses: increment(1),
      }, { merge: true });
      await setDoc(courseRef, newCourse, { merge: true });

      if (onCourseSubmit) {
        onCourseSubmit(newCourse);
      }

      setCourseDetails({
        courseTitle: "",
        description: "",
        category: "",
        price: "",
        language: "",
        difficulty: "",
        thumbnail: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setErrors({});
    } catch (err) {
      setError(`An error occurred: ${err}`);
    } finally {
      setIsSubmitting(false); // Ensure ring disappears after submission
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-6 mx-auto max-w-3xl relative">
      <button
        onClick={closeForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold"
      >
        ×
      </button>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Create Course</h3>
      {error && <p className="text-red-500">{error}</p>}

      {/* Course Title */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Course Title</label>
        <p className="text-sm text-slate-600 py-1">
          What would you like to name your course? Don't worry, you can change this later.
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
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              padding: "3px",
              boxShadow: "none",
              "&:hover": { borderColor: "#a0aec0" },
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
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              padding: "3px",
              boxShadow: "none",
              "&:hover": { borderColor: "#a0aec0" },
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
          <p className="text-green-600">Thumbnail uploaded: {courseDetails.thumbnail.name}</p>
        )}
        {errors.thumbnail && (
          <p className="text-red-500 text-sm">{errors.thumbnail}</p>
        )}
      </div>

      {/* Uploading Ring Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg font-semibold">Uploading thumbnail...</p>
            <div className="w-32 h-32">
              <CircularProgressbar
                value={uploadProgress}
                text={`${Math.round(uploadProgress)}%`}
                styles={{
                  path: { stroke: "hsl(48, 100%, 67%)" }, 
                  text: { fill: "#000", fontSize: "16px" },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end mt-6">
        <Button type="button" variant="ghost" onClick={closeForm} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="button" variant="ghost" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default CourseForm;