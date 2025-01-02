"use client";
import { useState } from "react";
export default function EditProfilePage() {
  // State to manage form inputs
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("@johndoe");
  const [email, setEmail] = useState("johndoe@example.com");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div>
      {/* Edit Profile Card */}
      <div className="flex items-center justify-center min-h-screen py-10">
        <div className="bg-[#2c3748] shadow-2xl rounded-3xl p-8 w-11/12 md:w-3/4 lg:w-1/2">
          <h2 className="text-3xl font-extrabold text-white mb-6">Edit Profile</h2>

          {/* Edit Profile Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r bg-[#daa520] text-white py-2 px-6 rounded-lg font-bold shadow-md hover:bg-[#9e5610] transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
