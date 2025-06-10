"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import {
  getFirestore,
  doc,
  setDoc,
  query,
  getDoc,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import {
  FaPhone,
  FaUser,
  FaAddressCard,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import { isValidPhoneNumber } from 'libphonenumber-js';

const firestore = getFirestore();

export default function CompleteProfile() {
  const { user } = useAuth();

  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [occupation, setOccupation] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const checkAddInfoFlag = async () => {
      try {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const addinfoFlag = userData.isAdditionalInfoAdded;

        if (addinfoFlag) {
          router.push("/learn");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    checkAddInfoFlag();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !username || !dob || !occupation) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedDob = dob ? new Date(dob) : null;

    if (parsedDob && isNaN(parsedDob.getTime())) {
      setError("Please enter a valid date");
      return;
    }

    if (isValidPhoneNumber(phoneNumber)) {
      setError("Please add a valid contact.");
      return;
    }

    setLoading(true); // Set loading to true when submitting
    setError(null); // Clear any previous errors

    try { 
      const usernameQuery = query(
        collection(firestore, "users"),
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(usernameQuery);

      if (!querySnapshot.empty) {
        const error = new Error("The username is already taken.");
        error.code = "username-taken"; // Custom error code
        throw error;
      }

      const userRef = doc(firestore, "users", user.uid);
      const userProgRef = doc(firestore, "userProgress", user.uid);

      await updateProfile(user, { displayName: name });

      const additionalData = {
        name,
        isAdditionalInfoAdded: true,
        username: username.toLowerCase(),
        dob: parsedDob,
        occupation,
        phoneNumber,
      };

      const progress = {
        uid : user.uid,
        username : username.toLowerCase(),
        streak : 0,
        streakGoal : 0,
        coins : 0,
        courseProgress : {},
        PLUH : {
          DS :{
            sample : 0,
            value : 0
          },
          ES :{
            value : 0
          },
          QPS :{
            sample : 0,
            value : 0
          },
          RPS :{},
        }
      }

      await setDoc(userRef, additionalData, { merge: true });
      await setDoc(userProgRef, progress, { merge: true });
      
      console.log("Profile completed successfully");
      router.push("/shop"); // Redirect to /learn page
    } catch (err) {
      setLoading(false); // Stop loading on error
      if (err.code === "username-taken") {
        setError("Username already taken. Please try something else.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header section with gradient */}
        <div className="bg-slate-900 px-8 py-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Complete Your Profile
          </h2>
          <p className="text-blue-100 text-sm">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <label htmlFor="name" className="text-gray-800 font-semibold text-sm">
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 focus-within:bg-white transition-all duration-200">
                      <FaUser className="text-gray-400 mr-3" />
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <label htmlFor="phoneNumber" className="text-gray-800 font-semibold text-sm">
                      Phone Number
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-opacity-20 focus-within:bg-white transition-all duration-200">
                      <FaPhone className="text-gray-400 mr-3" />
                      <input
                        type="text"
                        id="phoneNumber"
                        placeholder="Enter your contact number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <label htmlFor="username" className="text-gray-800 font-semibold text-sm">
                      Username
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-20 focus-within:bg-white transition-all duration-200">
                      <FaAddressCard className="text-gray-400 mr-3" />
                      <input
                        type="text"
                        id="username"
                        placeholder="Choose a unique username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <label htmlFor="dob" className="text-gray-800 font-semibold text-sm">
                      Date of Birth
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-opacity-20 focus-within:bg-white transition-all duration-200">
                      <FaCalendarAlt className="text-gray-400 mr-3" />
                      <input
                        type="date"
                        id="dob"
                        placeholder="Select your date of birth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                        className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Occupation Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <label htmlFor="occupation" className="text-gray-800 font-semibold text-sm">
                      Occupation
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-opacity-20 focus-within:bg-white transition-all duration-200">
                      <FaBriefcase className="text-gray-400 mr-3" />
                      <select
                        id="occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full outline-none bg-transparent text-gray-900 appearance-none"
                        required
                      >
                        <option value="">Select your occupation</option>
                        <option value="student">Student</option>
                        <option value="working">Working Professional</option>
                      </select>
                      <svg className="w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={loading || !name || !username || !dob || !occupation || !phoneNumber}
                className={`w-full bg-yellow-500 text-black rounded-xl px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 ${
                  loading || !name || !username || !dob || !occupation || !phoneNumber
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-yellow-600 hover:-translate-y-0.5"
                }`}
                whileHover={!(loading || !name || !username || !dob || !occupation || !phoneNumber) ? { scale: 1.02 } : {}}
                whileTap={!(loading || !name || !username || !dob || !occupation || !phoneNumber) ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-2 border-black border-t-transparent rounded-full"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Complete Profile
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}