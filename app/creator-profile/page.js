'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { FaPlus, FaTimes } from "react-icons/fa";
import { isValidPhoneNumber } from 'libphonenumber-js';

const firestore = getFirestore();

export default function CompleteCreatorProfile() {
    const router = useRouter();
    const { user } = useAuth();
    const [expertise, setExpertise] = useState([]);
    const [currentExpertise, setCurrentExpertise] = useState("");
    const [contact, setContact] = useState("");
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
                        router.push('/create/dashboard');
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
        if (currentExpertise.trim()) {
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

        if (isValidPhoneNumber(contact)) {
            setError("Please add a valid contact.");
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
                    updatedAt: new Date().toISOString()
                },
                contact,
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
            }

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
        <div className="h-screen w-full flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Complete Your Creator Profile</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Areas of Expertise
                        </label>
                        <div className="flex">
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
                                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addExpertise}
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-200"
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {expertise.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {expertise.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex items-center"
                                    >
                                        <span className="mr-2">{item}</span>
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-red-500 transition duration-200"
                                            onClick={() => {
                                                setExpertise(expertise.filter((_, i) => i !== index));
                                            }}
                                        >
                                            <FaTimes size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mt-2 text-sm">
                                Please add at least one area of expertise to continue.
                            </p>
                        )}
                    </div>

                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="bg-gray-200 outline-none text-sm flex-1"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={submitting || expertise.length === 0}
                            className={`border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400 mt-3 ${submitting || expertise.length === 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-current rounded-full"></span>
                                    Submitting...
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}