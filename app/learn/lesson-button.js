"use client";

import { Sword, Flag } from "lucide-react";
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

    const rightPosition = indentationLevel * 40;

    const isFirst = index === 0;
    const isLast = index === totalCount;
    const isCompleted = !current && !locked;

    const Icon = isCompleted ? Flag : Sword;

    //   const href = isCompleted ? `/lesson/${id}` : "/lesson";

    return (
        <Link
            href={'/courses'}
            aria-disabled={locked}
            style={{ pointerEvents: locked ? "none" : "auto" }}
        >
            <div
                className="relative"
                style={{
                    right: `${rightPosition}px`,
                    marginTop: isFirst && !isCompleted ? 60 : 24,
                }}
            >
                {current ? (
                    <div className="relative h-[102px] w-[102px]">
                        <div className="absolute -top-6 left-2.5 z-10 animate-bounce rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-[#4d3300]">
                            Start
                            <div
                                className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                                aria-hidden
                            />
                        </div>
                        <CircularProgressbarWithChildren
                            value={Number.isNaN(percentage) ? 0 : percentage}
                            styles={{
                                path: {
                                    stroke: "#eab208",
                                },
                                trail: {
                                    stroke: "#e5e7eb",
                                },
                            }}
                        >
                            <Button
                                size="rounded"
                                variant={locked ? "locked" : "secondary"}
                                className="h-[70px] w-[70px] border-b-8"
                            >
                                <Icon
                                    className={cn(
                                        "h-10 w-10",
                                        locked
                                            ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                                            : "fill-primary-foreground text-primary-foreground",
                                        isCompleted
                                    )}
                                />
                            </Button>
                        </CircularProgressbarWithChildren>
                    </div>
                ) : isLast ? (
                    <Image
                    src={"/images/treasureChest.png"}
                    width={70}
                    height={70}
                    />
                )  : (
                    <Button
                        size="rounded"
                        variant={locked ? "locked" : "secondary"}
                        className="h-[70px] w-[70px] border-b-8"
                    >
                        <Icon
                            className={cn(
                                "h-10 w-10",
                                locked
                                    ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                                    : "fill-primary-foreground text-primary-foreground",
                                isCompleted
                            )}
                        />
                    </Button>
                )}
            </div>
        </Link>
    );
};