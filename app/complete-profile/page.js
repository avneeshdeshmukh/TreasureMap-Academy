'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { getFirestore, doc, setDoc, query, getDoc, collection, where, getDocs } from "firebase/firestore";

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

    useEffect(() => {
        const checkAddInfoFlag = async () => {
            try {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                const addinfoFlag = userData.isAdditionalInfoAdded;

                if (addinfoFlag) {
                    router.push('/learn')
                }
            }
            catch (err) {
                setError(err.message)
            }
        }
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
            setError("Please enter a valid date")
            return
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

            const userRef = doc(firestore, "users", user.uid);
            await updateProfile(user, { displayName: name });

            const additionalData = {
                name,
                isAdditionalInfoAdded: true,
                username: username.toLowerCase(),
                dob: parsedDob,
                occupation,
            };

            await setDoc(userRef, additionalData, { merge: true });
            console.log("Profile completed successfully");
            router.push("/learn");

        } catch (err) {
            if (err.code === "username-taken") {
                setError("Username already taken. Please try something else.")
            }
            else {
                setError(err.message)
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                        <FaAddressCard className="text-gray-500 m-2" />
                        <input
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="bg-gray-200 outline-none text-sm flex-1"
                        />
                    </div>
                    <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                        <FaCalendarAlt className="text-gray-500 m-2" />
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                            className="bg-gray-200 outline-none text-sm flex-1"
                        />
                    </div>
                    <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                        <FaBriefcase className="text-gray-500 m-2" />
                        <select
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="bg-gray-200 outline-none text-sm flex-1"
                            required
                        >
                            <option value="">Select Occupation</option>
                            <option value="student">Student</option>
                            <option value="working">Working Professional</option>
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400"
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 font-semibold">{error}</p>}
                </div>
            </form>
        </div>
    )
}