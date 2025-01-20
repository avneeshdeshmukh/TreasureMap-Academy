"use client";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
//import { useRouter } from "next/navigation";
import CourseCard from "./coursecard";
import { Button } from "@/components/ui/button"

import Select from "react-select";

const courseCategories = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "arts", label: "Arts" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "photography", label: "Photography" },
  { value: "personal-development", label: "Personal Development" },
  { value: "languages", label: "Languages" },
  { value: "music", label: "Music" },
  { value: "data-science", label: "Data Science" },
  { value: "software-development", label: "Software Development" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "ai", label: "Artificial Intelligence" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "networking", label: "Networking" },
  { value: "blockchain", label: "Blockchain" },
  { value: "game-development", label: "Game Development" },
  { value: "design", label: "Design" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "video-editing", label: "Video Editing" },
  { value: "writing", label: "Writing" },
  { value: "creative-writing", label: "Creative Writing" },
  { value: "journalism", label: "Journalism" },
  { value: "psychology", label: "Psychology" },
  { value: "nutrition", label: "Nutrition" },
  { value: "sports", label: "Sports" },
  { value: "fitness", label: "Fitness" },
  { value: "yoga", label: "Yoga" },
  { value: "meditation", label: "Meditation" },
  { value: "cooking", label: "Cooking" },
  { value: "baking", label: "Baking" },
  { value: "gardening", label: "Gardening" },
  { value: "education", label: "Education" },
  { value: "teaching", label: "Teaching" },
  { value: "test-prep", label: "Test Preparation" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "real-estate", label: "Real Estate" },
  { value: "law", label: "Law" },
  { value: "history", label: "History" },
  { value: "economics", label: "Economics" },
  { value: "philosophy", label: "Philosophy" },
  { value: "biology", label: "Biology" },
  { value: "chemistry", label: "Chemistry" },
  { value: "physics", label: "Physics" },
  { value: "environment", label: "Environmental Science" },
];

const CourseForm = ({ closeForm, onCourseSubmit }) => {
  const [courseDetails, setCourseDetails] = useState({
    courseTitle: "",
    description: "",
    category: "",
    difficulty: "",
    thumbnail: null,
  });
  const [submittedCourses, setSubmittedCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  //const router = useRouter();
  const fileInputRef = useRef(null);

  const handleThumbnailUpload = (e) => {
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
      category: selectedOptions.map((option) => option.value), // Store selected values
    }));
  };

  const handleSubmit = () => {
    // Initialize error object
    const newErrors = {};
    if (!courseDetails.courseTitle) newErrors.courseTitle = "Course title is required.";
    if (!courseDetails.description) newErrors.description = "Description is required.";
    if (!courseDetails.category || courseDetails.category.length === 0)
      newErrors.category = "At least one category is required.";
    if (!courseDetails.difficulty) newErrors.difficulty = "Difficulty is required.";
    if (!courseDetails.thumbnail) newErrors.thumbnail = "Thumbnail is required.";
  
    // Set errors if any and exit early
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    // Disable the submit button
    setIsSubmitting(true);
  
    // Create a new course object
    const newCourse = {
      ...courseDetails,
      id: uuidv4(),
      thumbnailURL: URL.createObjectURL(courseDetails.thumbnail),
    };
  
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
          onChange={handleThumbnailUpload}
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
        variant="ghost"
          onClick={closeForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
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