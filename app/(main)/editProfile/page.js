"use client";
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const firestore = getFirestore();

export default async function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  // State to manage form inputs
  // const [name, setName] = useState("John Doe");
  // const [username, setUsername] = useState("@johndoe");
  // const [email, setEmail] = useState("johndoe@example.com");

   const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-[#1a2332] text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()} // Go back to the previous page
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Page Title */}
        <h2 className="text-4xl font-extrabold text-center mb-8">Edit Profile</h2>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Input */}
          <div>
            <label className="block text-lg font-semibold mb-2">Name</label>
            <input
              type="text"
              value={user.displayName}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Edit name"
            />
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-lg font-semibold mb-2">Username</label>
            <input
              type="text"
              value={userData.username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Edit username"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-lg font-semibold mb-2">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Edit email"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="secondary" type="submit">
              Save Changes
            </Button>
            <Button variant="danger" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
