import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";

export const Stats = ({ userProgress, courseId, setIsModalOpen }) => {
    const firestore = getFirestore();

    const [course, setCourse] = useState(null);
    
    const courseRef = doc(firestore, "courses", courseId);

    useEffect(() => {
        const fetchCourse = async () => {
            const courseSnap = await getDoc(courseRef);
            setCourse(courseSnap.data())
        }
        fetchCourse();
    }, [])

   


    return (
        course &&
        (<div
            className="text-white rounded-xl my-2 z-50 border-4 border-[#606060] text-lg bg-[#2c3748] justify-center p-5 shadow-lg"
        >
            <h2 className="font-bold text-2xl ms-3 mb-2">Course Stats</h2>
            <hr />
            <br />
            <ProgressBar
                currentValue={Math.max(userProgress.courseProgress[courseId].currentVideo - 1, 0)}
                maxValue={course.totalVideos}
                label="Lessons Completed"
            />
            <ProgressBar
                currentValue={userProgress.courseProgress[courseId].courseCoins || 0}
                // maxValue={300}
                label="Coins Earned"
            />
            <ProgressBar
                currentValue={userProgress.courseProgress[courseId].quizzesCompleted || 0}
                maxValue={course.totalQuizzes}
                label="Quizzes Completed"
            />
            {userProgress.streakGoal === 0 ? (
                    <>
                        <ProgressBar disabled={true} label="Streak Goal" />
                        <div className="flex justify-end">
                            <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
                                Set Goal
                            </Button>
                        </div>
                    </>
                ) : (
                    <ProgressBar
                        currentValue={userProgress.streak}
                        maxValue={userProgress.streakGoal}
                        label="Streak Goal"
                    />
                )}

                {/* Streak Goal Modal */}
               
        </div>)

    );
};
