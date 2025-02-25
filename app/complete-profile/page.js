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
import { motion } from "framer-motion"; // Import motion from framer-motion
import {
  FaUser,
  FaAddressCard,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";
import { updateProfile } from "firebase/auth";

const firestore = getFirestore();

export default function CompleteProfile() {
  const { user } = useAuth();

  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
      const userProgRef = doc(firestore, "userProgress", username.toLowerCase());

      await updateProfile(user, { displayName: name });

      const additionalData = {
        name,
        isAdditionalInfoAdded: true,
        username: username.toLowerCase(),
        dob: parsedDob,
        occupation,
      };

      const progress = {
        uid : user.uid,
        username : username.toLowerCase(),
        streak : 0,
        points : 0,
        courseProgress : {},
      }

      await setDoc(userRef, additionalData, { merge: true });
      await setDoc(userProgRef, progress, { merge: true });
      
      console.log("Profile completed successfully");
      router.push("/learn"); // Redirect to /learn page
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Complete Your Profile
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaAddressCard className="text-gray-500 mr-2" />
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="dob" className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="date"
                id="dob"
                placeholder="Select your date of birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="occupation"
              className="text-sm font-medium text-gray-700"
            >
              Occupation
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <FaBriefcase className="text-gray-500 mr-2" />
              <select
                id="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full outline-none bg-transparent"
                required
              >
                <option value="">Select Occupation</option>
                <option value="student">Student</option>
                <option value="working">Working Professional</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading || !name || !username || !dob || !occupation} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Logging in..." : "Submit"}{" "}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
