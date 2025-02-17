"use client"
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Header = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [delayedOpen, setDelayedOpen] = useState(false);

    const courses = [
        "Web Development",
        "Mobile Development",
        "Cloud Computing"
    ];

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setDelayedOpen(true), 100); // Slight delay before opening
            return () => clearTimeout(timer);
        } else {
            setDelayedOpen(false);
        }
    }, [isOpen]);

    return (
        <div className="sticky py-4 lg:top-2 top-14 bg-slate-800 lg:pt-[28px] flex items-center justify-between shadow-lg border-4 border-[#2c3748] border-b-8 border-b-[#11151c] mb-10 text-white rounded-sm z-50 lg:mt-[-28px]">
            <div />
            <div className="w-full flex justify-center">
                <div 
                    className="font-bold text-lg flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {title}
                    <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-700 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>

                <div 
                    className={`absolute top-full left-0 right-0 mt-2 bg-[#2c3748] border border-[#11151c] shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${delayedOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                    {courses.map((course, index) => (
                        <div key={index}>
                            <div
                                className="px-4 py-2 hover:bg-[#11151c] cursor-pointer transition-colors text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                {course}
                            </div>
                            {index !== courses.length - 1 && (
                                <div className="border-b border-dotted border-gray-500" />
                            )}
                        </div>
                    ))}
                    <div className="border-t border-dotted border-gray-500" />
                    <div 
                        className="px-4 py-2 text-center text-blue-400 hover:text-blue-300 cursor-pointer hover:bg-[#11151c] transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        View More
                    </div>
                </div>
            </div>
            <div />
        </div>
    );
};
