import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CoinAnimation({ coins, onComplete }) {
    // Animation variants for the coins
    const coinVariants = {
        initial: { 
            opacity: 1, 
            scale: 0,
            x: "50vw",
            y: "50vh"
        },
        animate: { 
            opacity: 0.8,
            scale: 1,
            x: "calc(100vw - 100px)", // Move to top-right
            y: "20px",
            transition: { 
                duration: 1,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
            }
        },
        exit: { 
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.3 }
        }
    };

    // Call the onComplete callback after animation finishes
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 1000); // Match animation duration
        
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div className="fixed z-50 pointer-events-none">
            {/* Create multiple coins based on the earned amount (max 5 for visual clarity) */}
            {Array.from({ length: Math.min(coins, 5) }).map((_, i) => (
                <motion.div
                    key={i}
                    variants={coinVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                        left: `${i * 10 - 20}px`, // Spread coins slightly
                    }}
                >
                    +1
                </motion.div>
            ))}
        </motion.div>
    );
}