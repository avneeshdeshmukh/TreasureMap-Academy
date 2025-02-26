"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import TopButton from "@/components/TopButton";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

import {
  FaFacebookF,
  FaGoogle,
  FaEnvelope,
  FaUser,
  FaAddressCard,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";
import { MdLock } from "react-icons/md";

const firestore = getFirestore();

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [occupation, setOccupation] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);

  const saveEmailUserData = async (user, additionalData) => {
    const { name, username, dob, occupation } = additionalData;

    // Convert dob to a Date object (if it's not already a Date object)
    const parsedDob = dob ? new Date(dob) : null;

    // Check if dob is valid
    if (parsedDob && isNaN(parsedDob.getTime())) {
      throw new Error("Invalid Date of Birth");
    }

    const userRef = doc(firestore, "users", user.uid);
    const userProgRef = doc(firestore, "userProgress", user.uid);

    const userData = {
      uid: user.uid,
      email: user.email,
      isAdditionalInfoAdded: true,
      isCreator: false,
      name,
      username: username.toLowerCase(),
      dob: parsedDob,
      occupation,
      provider: "email",
      createdAt: new Date(),
    };

    const progress = {
      uid : user.uid,
      username : username.toLowerCase(),
      streak : 0,
      points : 0,
      courseProgress : {},
    }

    await setDoc(userRef, userData, { merge: true });
    await setDoc(userProgRef, progress, { merge: true });
    console.log("Email sign-up data saved : ", userData);
  }

  const handleEmailSignUp = async (e) => {
    e.preventDefault();

    if (!name || !username || !dob || !occupation) {
      setError("Please fill in all required fields.");
      return;
    }

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
      // Sign up with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optionally update displayName
      await updateProfile(user, { displayName: name });

      const additionalData = { name, username, dob, occupation };

      // Save additional data
      await saveEmailUserData(user, additionalData);

      console.log("User signed up successfully!");
      router.push("/login");
    } catch (err) {
      // Handle specific errors
      if (err.code === "auth/email-already-in-use") {
        setError("The email address is already in use. Please use a different email or log in.");
      } else if (err.code === "auth/weak-password") {
        setError("The password is too weak. Please use a stronger password.");
      } else if (err.code === "auth/invalid-email") {
        setError("The email address is not valid. Please provide a valid email.");
      } else if (err.code === "username-taken") {
        setError("Username already taken. Please try something else.");
      } else {
        setError(`An unexpected error occurred. Please try again. ${err.code}`);
      }

      console.error("Error during sign-up:", err.message);
    }
  };

  const handleProviderSignUp = async (provider) => {
    try {

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email,
          isCreator: false,
          isAdditionalInfoAdded: false,
          provider: user.providerData[0]?.providerId,
          createdAt: new Date(),
        };

        await setDoc(userRef, userData, { merge: true });

        console.log("New user signed up with provider:", user.providerData[0]?.providerId);
        router.push("/complete-profile");
      }
      else {
        console.log("Existing user, signed in with provider:", user.providerData[0]?.providerId);
        router.push("/learn");
      }
    }
    catch (err) {
      setError(`An error occured ${err.message}`);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2 px-4 md:px-0"
      style={{ backgroundColor: "#efebe2" }}
    >
      <Head>
        <title>TMA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopButton href={'/home'} right="30px" type={'x'} color={'none'} outline={'gray'} />

      <main className="flex flex-col items-center justify-center w-full flex-1 md:px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full md:w-2/3 max-w-4xl">
          {/* Left Section */}
          <div className="w-full md:w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-blue-800">Treasure</span>
              <span className="text-yellow-400">Map</span>
              <span className="text-blue-800">Academy</span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-blue-800 mb-2">
                Create an account
              </h2>
              <div className="border-2 w-10 border-blue-800 inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <p className="border-2 text-blue-800 border-gray-200 rounded-full p-3 mx-1 cursor-pointer">
                  <FaFacebookF className="text-sm" />
                </p>
                <p
                  onClick={() => handleProviderSignUp(new GoogleAuthProvider())}
                  className="border-2 text-blue-800 border-gray-200 rounded-full p-3 mx-1 cursor-pointer">
                  <FaGoogle className="text-sm" />
                </p>
              </div>
              <p className="text-gray-400">or sign up with an email</p>
              <form className="mt-2">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-200 w-full max-w-xs p-2 flex items-center mb-3">
                    <FaUser className="text-gray-500 m-2" />
                    <input
                      type="text"
                      placeholder="Name"
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  <div className="bg-gray-200 w-full max-w-xs p-2 flex items-center mb-3">
                    <FaEnvelope className="text-gray-500 m-2" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  <div className="bg-gray-200 w-full max-w-xs p-2 flex items-center mb-3">
                    <FaAddressCard className="text-gray-500 m-2" />
                    <input
                      type="username"
                      placeholder="Username"
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  <div className="bg-gray-200 w-full max-w-xs p-2 flex items-center mb-3">
                    <FaCalendarAlt className="text-gray-500 m-2" />
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  <div className="bg-gray-200 w-full max-w-xs p-2 flex items-center mb-3">
                    <FaBriefcase className="text-gray-500 m-2" />
                    <select className="bg-gray-200 outline-none text-sm flex-1">
                      <option value="">Select Occupation</option>
                      <option value="student">Student</option>
                      <option value="working">Working Professional</option>
                    </select>
                  </div>
                  <div className="bg-gray-200 w-full max-w-xs p-2 flex items-center mb-3">
                    <MdLock className="text-gray-500 m-2" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400"
                  >
                    Sign Up with Email
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/5 bg-blue-800 text-yellow-400 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl py-8 md:py-36 px-6 md:px-12">
            <div className="flex flex-col items-center justify-center">
              <img
                src="/images/signup_pirate.png"
                alt="Pirate"
                className="w-32 md:w-45 h-32 md:h-45 mb-4"
              />
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Join Our Crew, Treasure Seeker!</h2>
              <div className="border-2 w-10 border-yellow-400 inline-block mb-2"></div>
              <p className="mb-5">Already have an account?</p>
              <Link
                href="/login"
                className="border-2 border-yellow-400 rounded-full px-12 py-2 inline-block font-semibold hover:bg-yellow-400 hover:text-blue-800"
              >
                Login Here
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
