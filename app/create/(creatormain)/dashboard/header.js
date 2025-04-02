import { Info } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Header = ({ user }) => {
  return (
    <div className="flex items-center justify-between mt-10 px-8">
      {/* Header aligned next to the sidebar */}
      <h1 className="font-bold text-3xl text-[#5a3b1a] text-center flex-shrink-0 ml-9">
        Welcome, {user.name}!
      </h1>

      <div className="w-full sm:w-auto flex items-center mr-7">
        <TooltipProvider>
          <Tooltip>
            <Link
              href="/create/information"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8f4eb] transition-colors duration-200"
            >
              <TooltipTrigger>
                <Info size={24} className="text-[#5a3b1a]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Instructions to create course on TMA</p>
              </TooltipContent>
            </Link>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
