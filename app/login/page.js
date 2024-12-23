"use client";
import Head from "next/head";
import Link from "next/link";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa";
import { MdLock } from "react-icons/md";
import Confetti from "react-confetti";
import TopButton from "@/components/TopButton";


const firestore = getFirestore();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // const [showConfetti, setShowConfetti] = useState(false);
  // const [showGif, setShowGif] = useState(false); // State to manage GIF visibility

  // const HandleLogin = () => {
  //   setShowConfetti(true);
  //   setShowGif(true); // Show GIF

  //   setTimeout(() => {
  //     router.push("/learn");
  //   }, 4500);
  // };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      // Log in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User logged in successfully!");

      // Redirect to the homepage or another protected page after successful login
      router.push("/courses"); // Replace with your desired route
    } catch (err) {
      // Handle specific errors
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("The email address is not valid. Please provide a valid email.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Error during login:", err.message);
    }
  };



  const handleProviderLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
      router.push("/courses");
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };



  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2"
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
                Sign in to account
              </h2>
              <div className="border-2 w-10 border-blue-800 inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <p
                  onClick={() => handleProviderLogin(new GoogleAuthProvider())}
                  className="border-2 text-blue-800 border-gray-200 rounded-full p-3 mx-1 cursor-pointer"
                >
                  <FaGoogle className="text-sm" />
                </p>
              </div>
              <p className="text-gray-400">or login with an email account</p>


              <form onSubmit={handleEmailLogin}>
                <div className="flex flex-col items-center mt-2">
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
                  <div className="flex w-64 mb-5 justify-between">
                    <label className="flex items-center text-xs">
                      <input type="checkbox" name="remember" className="mr-1" />
                      Remember me for 2 weeks
                    </label>
                    <a href="#" className="text-xs">
                      Forgot Password
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400"
                  >
                    Login
                  </button>
                  {error && <p>{error}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-2/5 bg-blue-800 text-yellow-400 rounded-tr-2xl rounded-br-2xl py-36 px-12 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center -mt-10">
              <img
                src="/images/login_pirate.png"
                alt="Pirate"
                className="w-45 h-45 mb-4"
              />
              <h2 className="text-3xl font-bold mb-2">
                Ahoy, Fearless Buccaneer!
              </h2>
              <div className="border-2 w-10 border-yellow-400 inline-block mb-2"></div>
              <p className="mb-5">Don't have an account yet?</p>
              <Link
                href="/signup"
                className="border-2 border-yellow-400 rounded-full px-12 py-2 inline-block font-semibold hover:bg-yellow-400 hover:text-blue-800"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main >

      {/* {showGif && (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center z-50">
          <img
            src="/images/treasure3.gif"
            alt="Treasure Chest Opening"
            className="w-1/2 h-auto max-w-2xl"
          />
        </div>
      )
      } */}

      {/* Fullscreen Confetti */}
      {/* {
        showConfetti && (
          <div className="fixed top-0 left-0 w-full h-full z-50">
            <Confetti numberOfPieces={1000} />
          </div>
        )
      } */}
    </div >
  );
}
