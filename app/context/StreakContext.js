"use client";
import { createContext, useState, useContext } from "react";

const StreakContext = createContext();

export function StreakProvider({ children }) {
    const [streak, setStreak] = useState(0);

    return (
        <StreakContext.Provider value={{ streak, setStreak }}>
            {children}
        </StreakContext.Provider>
    );
}

export function useStreak() {
    return useContext(StreakContext);
}
