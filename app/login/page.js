"use client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaEnvelope,
} from "react-icons/fa";
import { MdLock } from "react-icons/md";
import Confetti from "react-confetti";
import TopButton from "@/components/learn/TopButton";

export default function Home() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGif, setShowGif] = useState(false); // State to manage GIF visibility

  const handleLogin = () => {
    setShowConfetti(true);
    setShowGif(true); // Show GIF

    setTimeout(() => {
      router.push("/learn");
    }, 4500);
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
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaFacebookF className="text-sm text-blue-800" />
                </a>
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaLinkedinIn className="text-sm text-blue-800" />
                </a>
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaGoogle className="text-sm text-blue-800" />
                </a>
              </div>
              <p className="text-gray-400">or login with an email account</p>
              <div className="flex flex-col items-center mt-2">
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <FaEnvelope className="text-gray-500 m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-gray-200 outline-none text-sm flex-1"
                  />
                </div>
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <MdLock className="text-gray-500 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
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
                  onClick={handleLogin}
                  className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400"
                >
                  Login
                </button>
              </div>
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
      </main>

      {showGif && (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center z-50">
          <img
            src="/images/treasure3.gif"
            alt="Treasure Chest Opening"
            className="w-1/2 h-auto max-w-2xl" 
          />
        </div>
      )}

      {/* Fullscreen Confetti */}
      {showConfetti && (
        <div className="fixed top-0 left-0 w-full h-full z-50">
          <Confetti numberOfPieces={1000} />
        </div>
      )}
    </div>
  );
}
