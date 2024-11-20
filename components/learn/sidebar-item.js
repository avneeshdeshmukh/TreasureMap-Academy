import {Lightbulb, Medal, House, CircleUser, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const iconMap = {
    medal: Medal,
    bulb: Lightbulb,
    house : House,
    person : CircleUser,
    shop : Store,
};

const SidebarItem = ({ variant, href, icon, label }) => {
    const IconComponent = iconMap[icon]
    return (
        <Button
          variant={variant}
          className="h-[52px] justify-start ps-16 items-center my-4"
          size={"icon"}
          asChild
        >
          <Link href={href}>
          <IconComponent className="mr-5" size={32} stroke={"white"}/>
            {label}
          </Link>
        </Button>
      );
}

export default SidebarItem;