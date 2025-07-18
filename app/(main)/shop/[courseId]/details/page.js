"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { User, Clock, BookOpen, BarChart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
  setDoc,
  increment,
} from "firebase/firestore";
import { useAuth } from "@/app/context/AuthProvider";
import { setLatestCourse } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export default function Details() {
  const firestore = getFirestore();
  const { courseId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const courseRef = doc(firestore, "courses", courseId);
  const userRef = doc(firestore, "users", user.uid);
  const userProgRef = doc(firestore, "userProgress", user.uid);

  const [course, setCourse] = useState(null);
  const [userData, setUserData] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [creatorId, setCreatorId] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => alert('Failed to load Razorpay SDK');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const convertSecondsToHMS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, "0"), // Ensures 2-digit format
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const displayTime = (totalSeconds) => {
    const { hours, minutes, seconds } = convertSecondsToHMS(totalSeconds);

    // Convert to numbers to remove leading zeros
    const h = Number(hours);
    const m = Number(minutes);
    const s = Number(seconds);

    // Build time parts with correct singular/plural wording
    const parts = [];
    if (h > 0) parts.push(`${h} ${h === 1 ? "hour" : "hours"}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? "minute" : "minutes"}`);
    if (s > 0 || parts.length === 0)
      parts.push(`${s} ${s === 1 ? "second" : "seconds"}`);

    return parts.join(" ");
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const crs = await getDoc(courseRef);
      if (crs.exists()) {
        const crsData = crs.data();
        setCourse(crsData);
        setCreatorId(crsData.creatorId);
        setCurrentPrice(crsData.price);
      } else {
        console.log("Course not found");
      }
    };

    const fetchUserDetails = async () => {
      const usr = await getDoc(userRef);
      if (!usr.exists()) {
        console.log("User not found");
        return;
      }

      const usrData = usr.data();
      setUserData(usrData);
      console.log(usrData.enrolledCourses?.length);

      // Check if enrolledCourses exist and if it includes courseId
      setEnrolled(usrData.enrolledCourses?.includes(courseId) || false);

      const userProgSnap = await getDoc(userProgRef);
      const userCoins = userProgSnap.data().coins;
      setMaxDiscount(Math.floor(userCoins / 10000) * 10);
    };

    fetchCourseDetails();
    fetchUserDetails();
  }, [courseId, user, enrolled]);

  useEffect(() => {
    if (!creatorId) return;
    const fetchCourseProgress = async () => {
      const courseProgressRef = doc(firestore, "courseProgress", creatorId);
      const cpro = await getDoc(courseProgressRef);
      if (!cpro.exists()) {
        console.log("User not found");
        return;
      }

      const cproData = cpro.data();
      setReviews(cproData.courses?.[courseId]?.comments || []);
      console.log(cproData)
      setCourseProgress(cproData);
    };

    fetchCourseProgress();
  }, [course])

  useEffect(() => {
    if (!course) return;
    const fetchThumbnailUrl = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch("/api/getPresignedUrl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ filepath: course.thumbnailURL }),
        });

        if (!response.ok) throw new Error("Failed to fetch video URL");

        const data = await response.json();
        setThumbnail(data.videoUrl);
      } catch (err) {
        console.error("Error fetching thumbnail URL:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnailUrl();
  }, [course]);

  const increaseDiscount = () => {
    setDiscount(prev => Math.min(prev + 10, maxDiscount));
  };

  const decreaseDiscount = () => {
    setDiscount(prev => Math.max(prev - 10, 0));
  };

  useEffect(() => {
    if (!course) return;
    const discounted = course.price - (course.price * discount) / 100;
    setCurrentPrice(discounted); // Rounded for currency
  }, [discount]);

  const handleEnroll = async () => {
    if (!creatorId) return;
    try {
      const settlementId = uuidv4();
      const settlementRef = doc(firestore, "settlements", settlementId);

      const creatorSnap = await getDoc(doc(firestore, "users", creatorId));
      const creator = creatorSnap.data();

      const settlementEntry = {
        creatorId,
        buyer: user.uid,
        courseId: courseId,
        title: course.title,
        amount: course.price * 0.75,
        createdAt: new Date(),
        status: 0,
        upi: creator.creatorProfile.upi ?? null,
      }

      await setDoc(settlementRef, settlementEntry, { merge: true });

      // Attempt to update the enrolledCourses array
      await updateDoc(userRef, {
        enrolledCourses: arrayUnion(courseId),
      });
      const courseProgressRef = doc(firestore, "courseProgress", creatorId);
      await updateDoc(courseProgressRef, {
        totalEnrollments: increment(1),
        totalRevenue: increment(course.price * 0.75),
        [`courses.${courseId}.enrollments`]: increment(1),
        [`courses.${courseId}.revenue`]: increment(course.price * 0.75),
      });

      console.log("Course enrolled successfully!");
    } catch (error) {
      if (error.code === "not-found") {
        // If the user document doesn't exist, create it with enrolledCourses
        await setDoc(userRef, { enrolledCourses: [courseId] }, { merge: true });
        console.log("User document created with enrolled courses.");
      } else {
        console.error("Error enrolling in course:", error);
      }
    }
    try {
      const updateProgress = {
        courseId,
        currentVideo: 1,
      };

      if (discount > 0) {
        const coinsUsed = discount * 1000;
        await updateDoc(userProgRef, {
          [`courseProgress.${courseId}`]: updateProgress,
          coins: increment(-1 * coinsUsed),
        });
      } else {
        await updateDoc(userProgRef, {
          [`courseProgress.${courseId}`]: updateProgress,
        });
      }

    } catch (err) {
      console.error("Error enrolling in course:", error);
    }
    setDiscount(0);
    setCurrentPrice(course.price);
    setEnrolled(true);
  };

  const initiatePayment = async () => {
    if (!scriptLoaded || typeof window.Razorpay === 'undefined') {
      alert('Razorpay SDK failed to load. Please try again.');
      return;
    }
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: currentPrice }),
      });

      const data = await response.json();

      if (!data.orderId) {
        alert('Payment initiation failed');
        return;
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        order_id: data.orderId,
        name: 'TreasureMap Academy',
        description: `Payment for the course - ${course.title}`,
        handler: async (response) => {
          console.log('Payment Response:', response);

          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Redirect to success page with payment ID as query param
              handleEnroll();
            } else {
              alert('Payment verification failed');
              router.push('/error');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Error verifying payment');
            router.push('/error');
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
        },
        theme: {
          color: '#3399cc',
        },
        method: {
          upi: true,
          card: false, // Disable cards
          netbanking: false, // Disable netbanking
          wallet: false, // Disable wallets
          emi: false, // Disable EMI
          paylater: false, // Disable pay later
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoToCourse = async () => {
    console.log(userData.enrolledCourses);
    const latestCourses = setLatestCourse(userData.enrolledCourses, courseId);
    await updateDoc(userRef, {
      enrolledCourses: latestCourses,
    });
    router.push("/learn");
  };

  // Star Rating Component
  const StarRating = ({ rating, setRating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    // Ensure the timestamp is converted to a JavaScript Date object
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    }).format(date);
  };


  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.rating || !newReview.comment) {
      alert('Please select a rating and write a comment');
      return;
    }

    const submittedReview = {
      username: userData?.username || 'Anonymous',
      timestamp: new Date(),
      comment: newReview.comment,
      rating: newReview.rating
    };
    const courseProgressRef = doc(firestore, "courseProgress", creatorId);

    try {
      // Fetch current comments to calculate new average

      // Add new review to comments array
      const updatedComments = [...reviews, submittedReview];

      // Calculate average rating
      const totalRating = updatedComments.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / updatedComments.length;

      // Update Firestore with both comments and ratings
      await updateDoc(courseProgressRef, {
        [`courses.${courseId}.comments`]: arrayUnion(submittedReview),
        [`courses.${courseId}.ratings`]: averageRating, // New field for average rating
      });

      // Update local state
      setReviews(updatedComments);
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.code === "not-found") {
        // If document doesn't exist, create it with initial structure
        const averageRating = submittedReview.rating; // Single review case
        await setDoc(courseProgressRef, {
          courses: {
            [courseId]: {
              comments: [submittedReview],
              ratings: averageRating, // Initial average rating
            },
          },
        });
        setReviews([submittedReview]);
        setNewReview({ rating: 0, comment: "" });
      } else {
        setError("Failed to submit review. Please try again.");
      }
    }
  };

  if (course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Banner Section */}
          <div className="relative bg-yellow-500 text-white p-8 min-h-[360px] rounded-lg flex items-center">
            <div className="max-w-[calc(100%-320px)]">
              <h1 className="text-4xl font-extrabold tracking-tight leading-snug font-serif">
                {course.title}
              </h1>
              <p className="mt-4 text-lg text-white leading-relaxed tracking-wide font-sans">
                {course.description}
              </p>

              <p className="mt-2 text-yellow-800 text-sm flex items-center space-x-2">
                <span>Created by - {course.creator}</span>
                <span className="text-yellow-800">|</span>
                <span>Language - English</span>
              </p>
            </div>

            {/* Course Info Card */}
            <Card className="fixed top-[-80px] right-10 bg-white text-black w-80 shadow-lg translate-y-1/4">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  width={320}
                  height={300}
                  alt="Course thumbnail"
                  className="rounded-t-lg object-cover"
                />
              ) : (
                <div className="h-[300px] w-[320px] text-center p-4">
                  Loading thumbnail...
                </div>
              )}
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-center items-center space-x-2">
                  {discount > 0 ? (
                    <>
                      <p className="text-2xl text-gray-500 line-through">₹{course.price}</p>
                      <p className="text-3xl font-bold text-green-600">₹{currentPrice}</p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold">₹{course.price}</p>
                  )}
                </div>
                {!enrolled &&
                  <div>
                    {/* Discount label */}
                    <p className="text-lg font-semibold text-center">Your Discount</p>

                    {/* Discount Counter */}
                    <div className="flex items-center justify-center w-full">
                      <Button variant="ghost" onClick={decreaseDiscount} className="mr-3 px-4 py-2">
                        <span className="text-4xl leading-none">−</span>
                      </Button>

                      <span className="text-xl font-medium">{discount}%</span>

                      <Button variant="ghost" onClick={increaseDiscount} className="ml-3 px-4 py-2">
                        <span className="text-4xl leading-none">+</span>
                      </Button>
                    </div>

                    {/* Info text below counter */}
                    <p className="text-sm text-gray-500 text-center">10,000 coins = 10% discount</p>
                  </div>}
                {!enrolled ? (
                  <Button
                    className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-yellow-600 hover:scale-105 hover:shadow-lg"
                    onClick={initiatePayment}
                  >
                    Enroll Now
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 hover:shadow-lg"
                    onClick={handleGoToCourse}
                  >
                    ☑️ Go to course
                  </Button>
                )}

                <div className="text-sm text-gray-700 space-y-2">
                  <p>✓ Full lifetime access</p>
                  <p>✓ Access on mobile and desktop</p>
                </div>
              </CardContent>

            </Card>
          </div>

          {/* Course Details Section */}
          <div className="mt-8 grid grid-cols-3 gap-12">
            <div className="col-span-2 mr-10">
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 transition duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Course Details
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {displayTime(course.courseDuration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="text-green-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Total Lessons</p>
                      <p className="font-medium text-gray-900">
                        {course.totalVideos}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart className="text-yellow-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium text-gray-900">
                        {course.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="text-red-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Students Enrolled</p>
                      <p className="font-medium text-gray-900">
                        {courseProgress?.courses[courseId].enrollments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Reviews Section */}
              <div className="mt-8 bg-white border border-gray-300 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Student Reviews
                </h2>

                {/* Existing Reviews or No Reviews Message */}
                {reviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    <p>No reviews available yet</p>
                    <p className="text-sm mt-2">
                      Be the first to write a review!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {review.username}
                              </p>
                              <div className="text-yellow-500 flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={
                                      i < review.rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatTimestamp(review.timestamp)}
                          </p>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write a Review Form */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Write a Review
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-gray-700 font-medium">
                        Your Rating
                      </label>
                      <StarRating
                        rating={newReview.rating}
                        setRating={(rating) =>
                          setNewReview((prev) => ({ ...prev, rating }))
                        }
                      />
                    </div>

                    <textarea
                      name="comment"
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Write your review here..."
                      className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />

                    <Button
                      type="submit"
                      disabled={newReview.rating === 0} // Add this disable condition
                      className={`w-full font-semibold py-2 rounded-lg transition duration-300 ease-in-out ${newReview.rating === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                    >
                      Submit Review
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}