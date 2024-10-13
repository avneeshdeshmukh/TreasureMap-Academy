import Sidebar from "@/components/learn/Sidebar";
import TopButton from "@/components/learn/TopButton";
import { LessonButton } from "./LessonButton";
import Header from "@/components/learn/Header";
import Stats from "@/components/learn/Stats";
import LeaderboardPos from "@/components/learn/leaderboard-position";

export default function Home() {
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
    <div style={{
      background: `linear-gradient(
        rgba(0, 0, 0, 0.750), 
        rgba(0, 0, 0, 0.750)
      ), url('/images/bg-17.jpg')`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',
      backgroundAttachment : 'fixed'
    }}>
      <Header />
      <TopButton right="30px" href={'#'} type="coins" color={"none"} outline={"#facc15"} num={300} />
      <TopButton right="120px" href={'#'} type="flame" color={"orange"} outline={"none"} num={45}/>
      <LeaderboardPos />
      <Stats />

      <div className="flex">
        <Sidebar />
        <main className="mt-24 ms-[400px] me-[190px] text-black">
          <div className="lesson-container ms-[400px]">

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
        </main>
      </div>
    </div>
  );
}
