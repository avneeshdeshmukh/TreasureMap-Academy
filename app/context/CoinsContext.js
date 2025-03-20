"use client";
import { createContext, useState, useContext } from "react";

const CoinsContext = createContext();

export function CoinsProvider({ children }) {
    const [coins, setCoins] = useState(0);

    return (
        <CoinsContext.Provider value={{ coins, setCoins }}>
            {children}
        </CoinsContext.Provider>
    );
}

export function useCoins() {
    return useContext(CoinsContext);
}
