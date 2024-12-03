"use client";

import { Crown, Sword } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  // Dynamic positions
  const rightPosition = `${indentationLevel * 25}%`;
  const isOdd = index % 2 === 1;
  const isLast = index === totalCount - 1; // Fixed definition
  const isCompleted = !current && !locked;

  // Define Icon
  const Icon = isCompleted ? Crown : Sword;

  return (
    <Link
      href={"/tempvideoplayer"}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          marginTop: "2rem",
          transform: `translateX(${isOdd ? rightPosition : `-${rightPosition}`})`,
        }}
      >
        {current ? (
          <div className="relative h-32 w-20 sm:w-24 md:w-28 lg:w-32">
            {/* Start Label */}
            <div className="absolute -top-4 left-2 z-10 animate-bounce rounded-md border bg-white px-2 py-1 font-bold uppercase text-xs sm:text-sm md:text-base lg:text-sm tracking-wide text-[#4d3300]">
              Start
            </div>
            {/* Circular Progress */}
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: "#eab208" },
                trail: { stroke: "#e5e7eb" },
              }}
              className="scale-75"
            >
              <Button
                size="rounded"
                variant={locked ? "locked" : "secondary"}
                className="h-12 w-12 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
              >
                <Icon
                  className={cn(
                    " sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-8 lg:w-8",
                    locked
                      ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                      : "fill-primary-foreground text-primary-foreground",
                    isCompleted && "fill-none stroke-[4]"
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : isLast ? (
          <Image
            src={"/images/treasureChest.png"}
            alt="Treasure Chest"
            layout="auto"
            width={20}
            height={20}
            className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-10 lg:w-10"
          />
        ) : (
          <Button
            size="rounded"
            variant={locked ? "locked" : "secondary"}
            className="h-12 w-12 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
          >
            <Icon
              className={cn(
                "h-6 w-6 sm:h-4 sm:w-4 md:h-6 md:w-6 lg:h-8 lg:w-8",
                locked
                  ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                  : "fill-primary-foreground text-primary-foreground",
                isCompleted && "fill-none stroke-[4]"
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};