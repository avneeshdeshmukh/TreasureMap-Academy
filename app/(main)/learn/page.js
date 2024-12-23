import { FeedWrapper } from "@/components/feed-wrapper";
import {Stats} from "./stats";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { StreakIcons } from "@/components/streak-icons";
import { Header } from "./header";
import { LessonButton } from "./lesson-button";
import LeaderboardPos from "./leaderboard-position";

const learnPage = () => {
    const lessons = [
        { id: "1", index: 0, totalCount: 14, locked: false, current: false, percentage: 100 },
        { id: "2", index: 1, totalCount: 14, locked: false, current: false, percentage: 100 },
        { id: "3", index: 2, totalCount: 14, locked: false, current: true, percentage: 60 },
        { id: "4", index: 3, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "5", index: 4, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "6", index: 5, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "7", index: 6, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "8", index: 7, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "9", index: 8, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "10", index: 9, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "11", index: 10, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "12", index: 11, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "13", index: 12, totalCount: 14, locked: true, current: false, percentage: 0 },
        { id: "14", index: 14, totalCount: 14, locked: true, current: false, percentage: 0 },
    ];
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6" >
            <StickyWrapper>
                <StreakIcons streak={39} coins={65} />
                <Stats/>
                <LeaderboardPos/>
            </StickyWrapper>
            <FeedWrapper>
                <Header title={"Spanish"} />
                <div className="relative flex flex-col items-center">
                    {lessons.map((lesson, idx) => (
                        <LessonButton
                            key={lesson.id}
                            id={lesson.id}
                            index={lesson.index}
                            totalCount={lessons.length}
                            locked={lesson.locked}
                            current={lesson.current}
                            percentage={lesson.percentage}
                        />
                    ))}
                </div>
            </FeedWrapper>
        </div>
    )
}

export default learnPage;