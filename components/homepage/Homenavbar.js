import React from "react";

const Homenavbar = () => {
  return (
    <nav className="bg-yellow-400 text-slate-900 font-semibold text-lg flex justify-center items-center px-14 h-20">
      <div className="logo flex flex-col justify-center items-center">
        <span className="flex items-center justify-center gap-3">
          <img
            src="/images/logo1.png"
            alt=""
            className="h-14 w-auto object-contain mt-0.5"
          />
          <h4 className="font-bold mt-2 text-3xl">Tresure Map Academy</h4>
        </span>
      </div>

      {/* <ul className="flex justify-between gap-5">
        
        <li className="relative group">
          <span className="text-gray-800 transition-colors duration-300 hover:text-white cursor-pointer">
            Home
          </span>
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-950 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 " />
        </li>
        <li className="relative group">
          <span className="text-gray-800 transition-colors duration-300 hover:text-white cursor-pointer">
            Login
          </span>
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-950 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </li>
        <li className="relative group">
          <span className="text-gray-800 transition-colors duration-300 hover:text-white cursor-pointer">
            Sign Up
          </span>
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-950 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </li>
      </ul> */}
    </nav>
  );
};

export default Homenavbar;
