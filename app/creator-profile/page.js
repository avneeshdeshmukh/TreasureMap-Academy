'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import {
    FaUser,
    FaAddressCard,
    FaCalendarAlt,
    FaBriefcase,
} from "react-icons/fa";

const firestore = getFirestore();

export default function CompleteCreatorProfile() {
    const router = useRouter();
    const { user } = useAuth();
    const [expertise, setExpertise] = useState([]);
    const [currentExpertise, setCurrentExpertise] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkCreatorFlag = async () => {
            try {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                const creatorFlag = userData.isCreator;

                if (creatorFlag) {
                    router.push('/creatordashboard')
                }
            }
            catch (err) {
                console.log("error")
                setError(err.message)
            }
        }
        checkCreatorFlag();
    },[user, router]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!expertise) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            const userRef = doc(firestore, "users", user.uid);

            const creatorData = {
                isCreator: true,
                creatorProfile: {
                    expertise
                }
            };

            await setDoc(userRef, creatorData, { merge: true });
            console.log("Profile completed successfully");
            router.push("/creatordashboard");

        } catch (err) {
            setError(err.message)
        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center mt-2">
                    <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                        <FaAddressCard className="text-gray-500 m-2" />
                        <input
                            type="text"
                            placeholder="Add Expertise"
                            value={currentExpertise}
                            onChange={(e) => setCurrentExpertise(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && currentExpertise.trim()) {
                                    setExpertise([...expertise, currentExpertise.trim()]);
                                    setCurrentExpertise("");
                                    e.preventDefault(); // Prevent form submission on Enter
                                }
                            }}
                            className="bg-gray-200 outline-none text-sm flex-1"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {expertise.map((item, index) => (
                            <div
                                key={index}
                                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full flex items-center"
                            >
                                {item}
                                <button
                                    className="ml-2 text-red-500"
                                    onClick={() => {
                                        setExpertise(expertise.filter((_, i) => i !== index));
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-yellow-400 mt-3"
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 font-semibold">{error}</p>}
                </div>
            </form>
        </div>
    )
}