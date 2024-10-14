"use client"
import React, { useState } from 'react'
import "./home.css";

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle subscription logic here
        // For example, send email to the server or an API

        // Simulating a successful subscription
        setIsSubscribed(true);
        setEmail('');
    };

    return (
        <div className="custom-shadow newsletter-section bg-blue-950 text-white mx-auto py-20 max-w-[172vh] mb-12 shadow-lg rounded-lg">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                <p className="mb-6">Stay updated with our latest courses and resources!</p>

                {isSubscribed ? (
                    <div className="thank-you-message">
                        <h3 className="text-xl font-semibold">Thank you for subscribing!</h3>
                        <p>We appreciate your interest and will keep you updated.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="flex justify-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-r-lg transition duration-300"
                        >
                            Subscribe
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
export default Newsletter
