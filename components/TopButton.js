import { Flame, CircleDollarSign, X, CompassIcon} from "lucide-react";
import Link from "next/link";

const iconMap = {
    flame: Flame,
    coins: CircleDollarSign,
    x : X
};

const TopButton = ({ right, href, type, color, outline, num }) => {
    const isFlame = type === "flame"; // Updated: Set isFlame based on type
    const IconComponent = iconMap[type] || Flame;
    const animate = isFlame ? "animate-pulse" : ""; // Conditionally add class

    return (
        <Link
            href={href}
            className="fixed w-20 h-20 text-lg top-4 bg-transparent flex items-center justify-center z-99 hover: transition-colors duration-300"
            style={{
                right: right,
            }}
        >
            <IconComponent size={30}   />
            <p className="font-bold text-white text-lg">{num}</p>
        </Link>
    );
};

export default TopButton;
