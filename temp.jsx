import Sidebar from "@/components/learn/Sidebar";
import Navbar from "@/components/learn/Navbar";

export default function Home() {
  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[22.5rem]">
        {/* Navbar Component */}
        <div className="m-0 p-0">
          <Navbar />
        </div>
        
        {/* Main Content Container */}
        <div className="container mx-auto p-4">
          
        </div>
      </div>
    </div>
  );
}
