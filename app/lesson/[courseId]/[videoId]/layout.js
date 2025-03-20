import { CoinsProvider } from "@/app/context/CoinsContext";

export default function LessonLayout({ children }) {
    return <CoinsProvider>{children}</CoinsProvider>;
}
