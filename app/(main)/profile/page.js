"use client";
import { useAuth } from "@/app/context/AuthProvider";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <div className="bg-[#2c3748] shadow-2xl rounded-3xl p-8 w-11/12 md:w-3/4 lg:w-1/2">
        {/* User Info Section */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 border-b pb-6">
          <div className="w-24 h-24 relative mb-4 sm:mb-0">
            <Image
              src={"/images/test_avd.jpg"}// Replace with dynamic user avatar
              alt="User Avatar"
              layout="fill"
              className="rounded-full border-4 border-yellow-400"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-white">
              {/* {user.displayName} */}Avneesh Deshmukh
            </h1>
            <p className="text-white text-sm italic">@avdeshmukh</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 text-center">
          <div className="bg-[#daa520] rounded-lg p-4 shadow-md">
            <p className="text-2xl font-bold text-white break-words">14</p>
            <p className="font-bold text-[#9e5610] break-words">📚 Lessons</p>
          </div>
          <div className="bg-[#daa520] rounded-lg p-4 shadow-md">
            <p className="text-2xl font-bold text-white break-words">70</p>
            <p className="font-bold text-[#9e5610] break-words">📝 Quizzes</p>
          </div>
          <div className="bg-[#daa520] rounded-lg p-4 shadow-md">
            <p className="text-2xl font-bold text-white break-words">300</p>
            <p className="font-bold text-[#9e5610] break-words">💰 Coins</p>
          </div>
          <div className="bg-[#daa520] rounded-lg p-4 shadow-md">
            <p className="text-2xl font-bold text-white break-words">45</p>
            <p className="font-bold text-[#9e5610] break-words">🔥 Streak</p>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-white">Account Details</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex flex-col sm:flex-row justify-between bg-gray-100 p-4 rounded-lg shadow">
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold text-gray-700">johndoe@example.com</span>
            </li>
            <li className="flex flex-col sm:flex-row justify-between bg-gray-100 p-4 rounded-lg shadow">
              <span className="text-gray-500">Joined:</span>
              <span className="font-semibold text-gray-700">January 1, 2024</span>
            </li>
          </ul>
        </div>

        {/* Buttons Section */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <Link href="/editProfile">
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#daa520] to-[#9e5610] text-[white] py-2 px-6 rounded-lg font-bold shadow-md hover:from-[#9e5610] hover:to-[#daa520] transition">
              Edit Profile
            </button>
          </Link>

          <button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-lg font-bold shadow-md hover:from-red-600 hover:to-red-700 transition">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
