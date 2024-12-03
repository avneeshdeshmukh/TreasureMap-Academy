import Image from "next/image";
import SidebarItem from "./sidebar-item";

const Sidebar = () => {
  return (
    <div
      className="fixed h-screen top-0 left-0 text-white p-2 md:p-4 md:w-1/4 lg:w-1/4"
      style={{ backgroundColor: "#2c3748" }}
    >
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <h2 className="text-lg md:text-2xl font-bold my-2.5 text-center">
          <Image src="/images/logo.png" width={50} height={50} />
        </h2>

        {/* Sidebar items container */}
        <div className="flex flex-col items-center w-full space-y-6 mt-5">
          <SidebarItem
            variant={"sidebarOutlineActive"}
            icon={"house"}
            href={"#"}
            label={"Learn"}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl"
          />
          <SidebarItem
            variant={"sidebarOutline"}
            icon={"medal"}
            href={"#"}
            label={"Leaderboard"}
          />
          <SidebarItem
            variant={"sidebarOutline"}
            icon={"bulb"}
            href={"#"}
            label={"Quiz"}
          />
          <SidebarItem
            variant={"sidebarOutline"}
            icon={"shop"}
            href={"#"}
            label={"Shop"}
          />
          <SidebarItem
            variant={"sidebarOutline"}
            icon={"person"}
            href={"#"}
            label={"Profile"}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
