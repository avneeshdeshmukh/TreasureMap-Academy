import { Flame, CircleDollarSign } from "lucide-react";
import Link from "next/link";

const iconMap = {
    flame: Flame,
    coins: CircleDollarSign,
};

const TopButton = ({ right, href, type, color, outline, num }) => {
    const isFlame = type === "flame"; // Updated: Set isFlame based on type
    const IconComponent = iconMap[type] || Flame;
    const animate = isFlame ? "animate-pulse" : ""; // Conditionally add class

    return (
        <Link
            href={href}
            className="fixed w-[80px] h-[80px] text-lg top-[15px] bg-transparent flex items-center justify-center z-99 hover: transition-colors duration-300"
            style={{
                right: right,
            }}
        >
            <IconComponent className={`${animate} mx-2`} size={30} fill={color} stroke={outline} />
            <p className="font-bold text-white text-lg">{num}</p>
        </Link>
    );
};

export default TopButton;
