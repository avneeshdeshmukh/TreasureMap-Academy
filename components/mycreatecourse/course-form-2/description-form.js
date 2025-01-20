"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DescriptionForm = ({ initialData, courseId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    // Simulate API update
    console.log("Updating course title to:", title);

    toggleEdit();
    router.push(`/mycourses/${courseId}/edit-form`);
    router.refresh();
    alert("Course Updated!");
  };

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
        <p className="text-sm mt-2">{initialData?.title || "No title set"}</p>
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
};