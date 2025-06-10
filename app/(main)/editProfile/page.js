"use client";
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getDoc, getFirestore, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const firestore = getFirestore();

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(user.displayName || "");
          setUsername(userData.username || "");
          setProfileImagePreview(user.photoURL || "");
        }
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(user.photoURL || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if username is unique (skip if unchanged)
      const currentUserRef = doc(firestore, "users", user.uid);
      const currentUserSnap = await getDoc(currentUserRef);
      const currentUsername = currentUserSnap.data().username;

      if (username.toLowerCase() !== currentUsername.toLowerCase()) {
        const usernameQuery = query(
          collection(firestore, "users"),
          where("username", "==", username.toLowerCase())
        );
        const querySnapshot = await getDocs(usernameQuery);

        if (!querySnapshot.empty) {
          throw new Error("The username is already taken.");
        }
      }

      // TODO: Add image upload logic here
      if (profileImage) {
        console.log("Selected image:", profileImage);
        // Add your image upload logic here
      }

      await updateProfile(user, { displayName: name });
      
      // Update user document
      await updateDoc(doc(firestore, "users", user.uid), {
        username: username.toLowerCase(),
        name: name,
        updatedAt: new Date().toISOString()
      });

      toast.success('Profile updated successfully!', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#1a2332] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a2332] text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Page Title */}
        <h2 className="text-4xl font-extrabold text-center mb-8">Edit Profile</h2>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 relative">
                <Image
                  src={profileImagePreview || "/images/login_pirate.png"}
                  alt="Profile Preview"
                  layout="fill"
                  className="rounded-full border-4 border-yellow-400 object-cover"
                />
              </div>
              
              {/* Camera overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 p-2 rounded-full border-2 border-white transition-colors"
              >
                <Camera size={16} className="text-black" />
              </button>
            </div>

            {/* Image controls */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
              
              {profileImage && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <X size={16} className="mr-1" />
                  Remove
                </Button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-lg font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Edit name"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="secondary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="danger" onClick={() => router.push("/profile")} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}