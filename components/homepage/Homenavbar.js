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
                    <h4 className="font-bold mt-2 text-3xl">Treasure Map Academy</h4>
                </span>
            </div>
        </nav>
    );
};

export default Homenavbar;