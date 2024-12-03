import { Lightbulb, Medal, House, CircleUser, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const iconMap = {
  medal: Medal,
  bulb: Lightbulb,
  house: House,
  person: CircleUser,
  shop: Store,
};

const SidebarItem = ({ variant, href, icon, label }) => {
  const IconComponent = iconMap[icon];
  return (
    <Button
      variant={variant}
      className="h-11 sm:w-40 md:w-60 flex justify-start items-center sm:px-3 md:px-6 lg:px-12 w-full"
      size={"icon"}
      asChild
    >
      <Link href={href} className="flex items-center w-full">
        <IconComponent
          className="mr-5 text-base sm:text-lg md:text-xl lg:text-2xl"
          stroke={"white"}
          size={24}  // Adjust icon size on different screen sizes
        />
        {label}
      </Link>
    </Button>
  );
};

export default SidebarItem;
