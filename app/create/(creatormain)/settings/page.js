"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { User, Phone, Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaRupeeSign } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const firestore = getFirestore();

const SettingsPage = () => {
  const router = useRouter();
  const firestore = getFirestore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [expertise, setExpertise] = useState([]);
  const [currentExpertise, setCurrentExpertise] = useState('');
  const [contact, setContact] = useState("");
  const [upi, setUpi] = useState("");

  // const [profile, setProfile] = useState({
  //   username: '',
  //   contactNumber: '',
  //   upi:'',
  //   expertise: []
  // });

   useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserData(userData);
            setExpertise(userData.creatorProfile.expertise ?? []);
            setUpi(userData.creatorProfile.upi || "");
            setContact(userData.phoneNumber || "");
          }
        } catch (err) {
          setError("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [user]);

  const addExpertise = () => {
    if (currentExpertise.trim() && !expertise.includes(currentExpertise.trim())) {
      setExpertise([...expertise, currentExpertise.trim()]);
      setCurrentExpertise('');
    }
  };

  const removeExpertise = (indexToRemove) => {
    setExpertise(expertise.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(expertise.length <= 0 || upi==="" || contact===""){
      return;
    }
    try{
      const userRef = doc(firestore, "users", user.uid);
  
      await updateDoc(userRef, {
        phoneNumber : contact,
        [`creatorProfile.upi`] : upi,
        [`creatorProfile.expertise`] : expertise,
      })

      toast.success('Profile updated successfully!', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });

      router.push("/create/settings");
    } catch(e){
      console.log(e);
    }
  }

 if(userData){

  return (
    <div className="bg-[#efeeea] min-h-full py-1">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-[#5a3b1a] flex mb-6 justify-center">Edit Profile</h1>

        {/* Contact Number Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <Phone className="mr-3 text-gray-600" />
            <label className="font-semibold">Contact Number</label>
          </div>
          <input
            type="text"
            name="contactNumber"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter your contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>

        {/* UPI Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <FaRupeeSign className="mr-3 text-gray-600" />
            <label className="font-semibold">UPI ID</label>
          </div>
          <input
            type="text"
            name="contactNumber"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="Enter your contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>

        {/* Expertise Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <Star className="mr-3 text-gray-600" />
            <label className="font-semibold">Areas of Expertise</label>
          </div>

          <div className="flex">
            <input
              type="text"
              value={currentExpertise}
              onChange={(e) => setCurrentExpertise(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addExpertise();
                }
              }}
              placeholder="Add your expertise (e.g., Web Development)"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="button"
              onClick={addExpertise}
              className="bg-yellow-500 text-white px-4 py-3 rounded-r-lg hover:bg-yellow-600 transition duration-200 flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </div>

          {expertise.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-yellow-800 px-3 py-2 rounded-lg flex items-center"
                >
                  <span className="mr-2">{item}</span>
                  <button
                    type="button"
                    className="text-yellow-600 hover:text-red-500 transition duration-200"
                    onClick={() => removeExpertise(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mt-2 text-sm">
              Please add at least one area of expertise.
            </p>
          )}
        </div>

        {/* Save Changes Button */}
        <Button
          variant="submit"
          className="w-fit font-semibold py-3 rounded-lg transition-all"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
      <ToastContainer/>
    </div>
  );
}
};

export default SettingsPage;