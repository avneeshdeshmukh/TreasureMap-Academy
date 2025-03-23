"use client";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-yellow-900 mb-6">Settings</h1>

      {/* Edit Profile */}
      <div className="bg-[#f8e8c8] p-4 rounded-lg shadow-md mb-6 border border-yellow-700">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Edit Profile</h2>
        <label className="block text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          placeholder="Enter your full name"
        />
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          placeholder="Enter your email"
        />
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow-md transition-all duration-300">
          Save Profile
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-[#f8e8c8] p-4 rounded-lg shadow-md mb-6 border border-yellow-700">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Change Password</h2>
        <label className="block text-gray-700 mb-1">Current Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          placeholder="Enter current password"
        />
        <label className="block text-gray-700 mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          placeholder="Enter new password"
        />
        <label className="block text-gray-700 mb-1">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          placeholder="Confirm new password"
        />
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow-md transition-all duration-300">
          Update Password
        </button>
      </div>

      {/* Default Quiz Duration */}
      <div className="bg-[#f8e8c8] p-4 rounded-lg shadow-md mb-6 border border-yellow-700">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Default Quiz Duration</h2>
        <label className="block text-gray-700 mb-1">Quiz Time (in minutes)</label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          placeholder="E.g., 30"
        />
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow-md transition-all duration-300">
          Set Duration
        </button>
      </div>

      {/* Notifications and Communications */}
      <div className="bg-[#f8e8c8] p-4 rounded-lg shadow-md mb-6 border border-yellow-700">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Notifications & Communications</h2>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
          />
          <label className="text-gray-700">Email notifications for new enrollments</label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
          />
          <label className="text-gray-700">Email notifications for quiz completions</label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
          />
          <label className="text-gray-700">In-app alerts for crew updates</label>
        </div>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow-md transition-all duration-300">
          Save Preferences
        </button>
      </div>
    </div>
  );
}