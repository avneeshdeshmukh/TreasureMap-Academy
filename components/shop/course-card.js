import { Button } from "@/components/ui/button";
import { setLatestCourse } from "@/lib/utils";
import { updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const CourseCard = ({ title, thumbnail, enrolledDate, courseId, buttonLabel, userData, userDocRef }) => {

    const router = useRouter();

    const handleCourseManip = async () => {
        const latestCourses = setLatestCourse(userData.enrolledCourses, courseId);
        await updateDoc(userDocRef, {
            enrolledCourses: latestCourses
        })
        router.push('/learn');
    }

    return (
        <div className="flex-none w-72 bg-[#092247] rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            {/* Thumbnail */}
            <div className="relative w-full h-40">
                <img
                    src={thumbnail || "/api/placeholder/400/320"}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-white truncate">{title}</h3>

                {/* Enrolled Date */}
                {/* <div className="text-sm text-gray-400">Enrolled on: {formattedDate}</div> */}

                {/* Action Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCourseManip}
                >
                    {buttonLabel}
                </Button>
            </div>
        </div>
    );
};

export default CourseCard;
