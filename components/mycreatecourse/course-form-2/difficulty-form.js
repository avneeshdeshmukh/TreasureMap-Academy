"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DifficultyForm = ({ initialData, courseId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "");

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!difficulty) {
      alert("Please select a difficulty level.");
      return;
    }

    // Simulate API update
    console.log("Updating course difficulty to:", difficulty);

    toggleEdit();
    router.push(`/mycourses/${courseId}/edit-form`);
    router.refresh();
    alert("Course Updated!");
  };

  return (
    <div className="mt-6 border bg-[#ffffff] shadow-md rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Difficulty</span>
        <Button onClick={toggleEdit} variant="plain" size="vsm">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Difficulty
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">{difficulty || "No difficulty level set"}</p>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>
                Select difficulty level
              </option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit" variant="ghost">Save</Button>
          </div>
        </form>
      )}
    </div>
  );
};
