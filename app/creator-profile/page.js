"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

const firestore = getFirestore();

export default function CompleteCreatorProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [expertise, setExpertise] = useState([]);
  const [currentExpertise, setCurrentExpertise] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkCreatorFlag = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.isCreator) {
            router.push("/create/dashboard");
          }
        }
      } catch (err) {
        console.error("Error checking creator status:", err);
        setError("Unable to verify your account status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkCreatorFlag();
  }, [user, router]);

  const addExpertise = () => {
    if (currentExpertise.trim() && !expertise.includes(currentExpertise.trim())) {
      setExpertise([...expertise, currentExpertise.trim()]);
      setCurrentExpertise("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (expertise.length === 0) {
      setError("Please add at least one area of expertise.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const courseProgressRef = doc(firestore, "courseProgress", user.uid);

      const creatorData = {
        isCreator: true,
        creatorProfile: {
          expertise,
          updatedAt: new Date().toISOString(),
          upi,
        },
      };

      const progress = {
        userId: user.uid,
        username: userData.username,
        totalCourses: 0,
        publishedCourses: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalEnrollments: 0,
        courses: {},
      };

      await setDoc(courseProgressRef, progress);

      await setDoc(userRef, creatorData, { merge: true });
      router.push("/create/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Keep navbar exactly as original */}
      <nav className="bg-slate-900 min-h-14 p-4 text-white flex justify-between items-center sticky top-0 z-50">
        <div>
          <Button
            variant="ghost"
            className="text-white p-2 hover:bg-slate-800"
            onClick={() => {
              router.push("/profile");
            }}
          >
            <ArrowBigLeft className="cursor-pointer" />
            <span className="ml-2">Back to profile</span>
          </Button>
        </div>
      </nav>

      {/* Improved main content */}
      <div className="flex justify-center px-4 mt-3">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header section with better styling */}
          <div className="bg-slate-900 px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Complete Your Creator Profile
            </h1>
            <p className="text-blue-100 text-sm">
              Share your expertise and payment details to get started
            </p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Areas of Expertise Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <label className="text-gray-800 font-semibold text-lg">
                    Areas of Expertise
                  </label>
                </div>
                
                <div className="relative">
                  <div className="flex shadow-sm rounded-xl overflow-hidden border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all duration-200">
                    <input
                      type="text"
                      placeholder="Add your expertise (e.g., Web Development)"
                      value={currentExpertise}
                      onChange={(e) => setCurrentExpertise(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addExpertise();
                        }
                      }}
                      className="flex-grow px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group"
                    >
                      <FaPlus className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

                {/* Expertise tags */}
                {expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {expertise.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center space-x-2 border border-blue-200 hover:shadow-md transition-all duration-200"
                      >
                        <span className="font-medium">{item}</span>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                          onClick={() => {
                            setExpertise(expertise.filter((_, i) => i !== index));
                          }}
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-amber-700 text-sm flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Please add at least one area of expertise to continue.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* UPI Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <label className="text-gray-800 font-semibold text-lg">
                    Payment Information
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your UPI ID (e.g., yourname@paytm)"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 focus:bg-white transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || expertise.length === 0 || !upi.trim()}
                  className={`w-full bg-yellow-600 text-white rounded-xl px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                    submitting || expertise.length === 0 || !upi.trim()
                      ? "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-lg"
                      : "hover:bg-yellow-700"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin h-3 w-3 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating Profile...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Complete Profile
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}