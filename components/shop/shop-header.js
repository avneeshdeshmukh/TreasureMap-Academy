import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const ShopHeader = ({ searchQuery, onSearchChange }) => {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All Courses' },
        { id: 'featured', label: 'Featured' },
        { id: 'new', label: 'New Arrivals' },
        { id: 'popular', label: 'Popular' }
    ];

    return (
        <div className="w-full shadow-lg m-3">
            <div className="max-w-7xl mx-auto px-4">
                {/* Title and Search Section */}
                <div className="pt-6 pb-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold">Explore Courses</h1>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={onSearchChange}
                                className="w-full pl-10 pr-4 py-2 bg-[#1e2532] border-gray-700 text-white 
                                         placeholder-gray-400 focus:ring-yellow-500 focus:border-yellow-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 border-b border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium transition-colors
                                ${activeTab === tab.id 
                                    ? 'border-b-2 border-yellow-500' 
                                    : 'text-slate-500 hover:text-white hover:bg-[#1e2532]'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};