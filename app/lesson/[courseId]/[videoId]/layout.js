import { CoinsProvider } from "@/app/context/CoinsContext";
import { StreakProvider } from "@/app/context/StreakContext";
import ProtectedRoute from "@/components/protected-route";

export default function LessonLayout({ children }) {
    return (
        <ProtectedRoute>
            <CoinsProvider>
                <StreakProvider>
                    {children}
                </StreakProvider>;
            </CoinsProvider>;
        </ProtectedRoute>
    );
}
