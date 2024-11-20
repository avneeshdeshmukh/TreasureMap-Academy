"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import TopButton from "@/components/learn/TopButton";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdLock } from "react-icons/md";

const firestore = getFirestore();

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const saveUserData = async (user, additionalData) => {
    const userRef = doc(firestore, "users", user.uid);
    const userData = {
      uid: user.uid,
      provider: user.providerData[0]?.providerId || "email",
      createdAt: new Date(),
    };

    await setDoc(userRef, userData, { merge: true });
    console.log("User data saved:", userData);
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      // Sign up with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Optionally update displayName
      await updateProfile(user, { displayName: name });
  
      // Save additional data
      await saveUserData(user, { name });
  
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
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
  
      console.error("Error during sign-up:", err.message);
    }
  };

  const handleProviderSignUp = async (provider) => {
    try {

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Save additional data (if any)
      await saveUserData(user, {});
      router.push("/courses");
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2 "
      style={{ backgroundColor: "#efebe2" }}
    >
      <Head>
        <title>TMA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopButton href={'/home'} right="30px" type={'x'} color={'none'} outline={'gray'} />

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          {/* Left Section */}
          <div className="w-3/5 p-5">
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
                <p
                  className="border-2 text-blue-800 border-gray-200 rounded-full p-3 mx-1 cursor-pointer"
                >
                  <FaFacebookF className="text-sm" />
                </p>
                <p
                  onClick={() => handleProviderSignUp(new GoogleAuthProvider())}
                  className="border-2 text-blue-800 border-gray-200 rounded-full p-3 mx-1 cursor-pointer"
                >
                  <FaGoogle className="text-sm" />
                </p>
              </div>
              <p className="text-gray-400">or sign up with an email</p>
              <form onSubmit={handleEmailSignUp}>
                <div className="flex flex-col items-center mt-2">
                  <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                    <FaUser className="text-gray-500 m-2" />
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                    <FaEnvelope className="text-gray-500 m-2" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                    <MdLock className="text-gray-500 m-2" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div>
                  {/* <div className="bg-gray-200 w-64 p-2 flex items-center mb-3 text-gray-500">
                    <FaCalendarAlt className="text-gray-500 m-2" />
                    <input
                      type="date"
                      name="dob"
                      placeholder="Date of Birth"
                      className="bg-gray-200 outline-none text-sm flex-1"
                    />
                  </div> */}

                  <button
                  type="submit"
                    className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400"
                  >
                    Sign Up with Email
                  </button>
                  {error && <p>{error}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-2/5 bg-blue-800 text-yellow-400 rounded-tr-2xl rounded-br-2xl py-36 px-12 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center -mt-10">
              {" "}
              {/* Added a flex container with negative margin */}
              <img
                src="/images/signup_pirate.png"
                alt="Pirate"
                className="w-45 h-45 mb-4" // Maintain the size as in the login section
              />
              <h2 className="text-3xl font-bold mb-2">Join Our Crew, Treasure Seeker!</h2>
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
