"use client"; 

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(loading);
      setUser(user); 
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // if (loading) {
  //     return(
  //     <div className="flex items-center justify-center w-screen h-screen bg-[#2c3748] p-0 m-0">
  //       <div className="bg-yellow-500 w-4 h-16 animate-wave"></div>
  //       <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.1s' }}></div>
  //       <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.2s' }}></div>
  //       <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.3s' }}></div>
  //       <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.4s' }}></div>
  //     </div>
  //     );
  // }
  if (loading) {
      return(
      <div className="flex space-x-2 items-center justify-center h-screen bg-[#2c3748] p-0 m-0">
        <div className="bg-yellow-500 w-4 h-16 animate-wave"></div>
        <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.1s' }}></div>
        <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.2s' }}></div>
        <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.3s' }}></div>
        <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.4s' }}></div>
      </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
