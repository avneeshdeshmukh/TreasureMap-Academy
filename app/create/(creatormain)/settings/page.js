"use client"
import React, { useState } from 'react';
import { User, Phone, Star, Plus, X  } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    username: '',
    contactNumber: '',
    expertise: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [currentExpertise, setCurrentExpertise] = useState('');

  const addExpertise = () => {
    if (currentExpertise.trim() && !profile.expertise.includes(currentExpertise.trim())) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, currentExpertise.trim()]
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

  return (
    <div className="bg-[#efeeea] min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-[#5a3b1a] mb-6">Edit Profile</h1>
        
        {/* Username Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <User className="mr-3 text-yellow-600" />
            <label className="font-semibold">Username</label>
          </div>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
          />
          <Button 
        variant="submit"
          className="w-full font-semibold py-3 rounded-lg transition-all"
        >
          Update Username
        </Button>
        </div>

        {/* Contact Number Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <Phone className="mr-3 text-yellow-600" />
            <label className="font-semibold">Contact Number</label>
          </div>
          <input
            type="tel"
            name="contactNumber"
            value={profile.contactNumber}
            onChange={handleInputChange}
            placeholder="Enter your contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
          />
          <Button 
        variant="submit"
          className="w-full font-semibold py-3 rounded-lg transition-all"
        >
          Save Contact
        </Button>
        </div>

        {/* Expertise Section */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 mb-2">
            <Star className="mr-3 text-yellow-600" />
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
          
          {profile.expertise.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.expertise.map((item, index) => (
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

        {/* Save Button */}
        <Button 
        variant="submit"
          className="w-full font-semibold py-3 rounded-lg transition-all"
        >
          Update Expertise
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;