"use client";
import Head from "next/head";
import Link from 'next/link';

import {
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdLock } from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 " style={{backgroundColor: '#efebe2'}}>
      <Head>
        <title>TMA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          {/* Left Section */}
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-blue-400">Treasure</span>Map
              <span className="text-blue-400">Academy</span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-blue-400 mb-2">
                Create an account
              </h2>
              <div className="border-2 w-10 border-blue-400 inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaGoogle className="text-sm" />
                </a>
              </div>
              <p className="text-gray-400">or sign up with an email</p>

              <div className="flex flex-col items-center mt-2">
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                  <FaUser className="text-gray-500 m-2" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="bg-gray-200 outline-none text-sm flex-1"
                  />
                </div>
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
                <div className="bg-gray-200 w-64 p-2 flex items-center mb-3 text-gray-500">
                  <FaCalendarAlt className="text-gray-500 m-2" />
                  <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    className="bg-gray-200 outline-none text-sm flex-1"
                  />
                </div>
               
                <Link href="/login"
                   className="border-2 border-blue-400 text-blue-400 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-400 hover:text-white">
                    Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-2/5 bg-blue-400 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Hello Pirate</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">Already have an account?</p>
        

            <Link href="/login"
                  className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-400">
                  Login Here
                  
                </Link>

          </div>
        </div>
      </main>
    </div>
  );
}
