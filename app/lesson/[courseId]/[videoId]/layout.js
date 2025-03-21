import { CoinsProvider } from "@/app/context/CoinsContext";
import ProtectedRoute from "@/components/protected-route";

export default function LessonLayout({ children }) {
    return (
        <ProtectedRoute>
            <CoinsProvider>{children}</CoinsProvider>;
        </ProtectedRoute>
    );
}
