"use client"
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Header = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const courses = [
        "Web Development",
        "Mobile Development",
        "Cloud Computing"
    ];

    return (
        <div className="relative sticky lg:top-2 top-14 bg-[#2c3748] lg:pt-[28px] flex items-center justify-between shadow-lg border-4 border-[#2c3748] border-b-8 border-b-[#11151c] mb-10 text-white rounded-sm z-50 lg:mt-[-28px]">
            <div />
            <div className="w-full flex justify-center">
                <div 
                    className="font-bold text-lg flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {title}
                    <ChevronDown 
                        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#2c3748] border border-[#11151c] shadow-lg">
                        {courses.map((course, index) => (
                            <div key={index}>
                                <div
                                    className="px-4 py-2 hover:bg-[#11151c] cursor-pointer transition-colors text-center"
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
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
                            onClick={() => {
                                // Handle view more click
                                setIsOpen(false);
                            }}
                        >
                            View More
                        </div>
                    </div>
                )}
            </div>
            <div />
        </div>
    );
};