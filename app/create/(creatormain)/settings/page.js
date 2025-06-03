"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { User, Phone, Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const firestore = getFirestore();

const SettingsPage = () => {
  const firestore = getFirestore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currentExpertise, setCurrentExpertise] = useState([]);

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
            setCurrentExpertise(userData.creatorProfile.expertise ?? []);
          }
        } catch (err) {
          setError("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [user]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExpertise = () => {
    const trimmed = currentExpertise.trim();
    if (trimmed && !currentExpertise.includes(trimmed)) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, trimmed]
      }));
      setCurrentExpertise('');
    }
  };

  const removeExpertise = (indexToRemove) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, index) => index !== indexToRemove)
    }));
  };

 if(userData){

  return (
    <div className="bg-[#efeeea] min-h-full py-1">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-[#5a3b1a] flex mb-6 justify-center">Edit Profile</h1>

        {/* Username Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <User className="mr-3 text-gray-600" />
            <label className="font-semibold">Username</label>
          </div>
          <input
            type="text"
            name="username"
            value={userData.username}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
          />
         
        </div>

        {/* Contact Number Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <Phone className="mr-3 text-gray-600" />
            <label className="font-semibold">Contact Number</label>
          </div>
          <input
            type="text"
            name="contactNumber"
            value={userData.contact}
            onChange={handleInputChange}
            placeholder="Enter your contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>

        {/* UPI Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <Phone className="mr-3 text-gray-600" />
            <label className="font-semibold">UPI ID</label>
          </div>
          <input
            type="text"
            name="contactNumber"
            value={userData.creatorProfile.upi}
            onChange={handleInputChange}
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

          {currentExpertise.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {currentExpertise.map((item, index) => (
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
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
};

export default SettingsPage;