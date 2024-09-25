import Image from "next/image";
import Link from "next/link";

import type { Tutorial } from "@/server/db/schema/tutorial";
import {
  CalendarClockIcon,
  GraduationCapIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import TutorialCreationDialog from "./tutorial-creation-dialog";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ClassesGrid({ tutorials }: { tutorials: Tutorial[] }) {
  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="flex w-full items-center justify-between space-x-2">
        <div className="relative ml-auto flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a class..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <TutorialCreationDialog />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 min-[870px]:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5">
        {tutorials.map((cls, index) => (
          <Link
            href={`tutorials/${cls.id}`}
            key={cls.id}
            className={cn(
              // "group relative flex aspect-square justify-between rounded-lg border border-border bg-card shadow-lg hover:cursor-pointer",
              "group relative flex aspect-square justify-between rounded-lg border bg-card hover:cursor-pointer",
              "transition-all duration-300",
              index === 0 && "sm:col-span-2 sm:row-span-2 sm:aspect-square",
              // index === 1 && "col-span-2 row-span-1 aspect-auto",
              index > 0 && "sm:hover:row-span-2 sm:hover:aspect-auto",
            )}
          >
            <div className="relative flex h-full grow flex-col items-start justify-between space-y-2 p-4">
              <span className="text-3xl font-medium text-card-foreground">
                {cls.name}
              </span>
              <div className="flex w-full flex-grow overflow-hidden">
                <Image
                  // src={cls.img ?? "/placeholder.svg"}
                  src={"/placeholder.svg"}
                  alt="placeholder"
                  unoptimized
                  width={0}
                  height={0}
                  className={cn(
                    "rounded-md object-cover transition-opacity duration-200 ease-in",
                    index === 0 &&
                      "hidden h-full w-full rounded-lg object-cover sm:block",
                    // index === 1 &&
                    //   "opacity-0 max-lg:group-hover:opacity-100 sm:group-hover:grow lg:group-hover:grow-0",
                    index > 0 &&
                      "opacity-0 group-hover:opacity-100 sm:group-hover:grow",
                  )}
                />
              </div>
              <div className="space-y-2 rounded-md pt-2 text-sm text-muted-foreground">
                <div className="flex items-start space-x-1">
                  <GraduationCapIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    Joanna Lin
                  </span>
                </div>
                <div className="flex items-start space-x-1">
                  <MapPinIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    {cls.location}
                  </span>
                </div>
                <div className="flex items-start space-x-1">
                  <CalendarClockIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    {daysOfWeek[cls.dayOfWeek]},{" "}
                    {cls.startTime.split(":").slice(0, 2).join(":")} -{" "}
                    {cls.endTime.split(":").slice(0, 2).join(":")}
                  </span>
                </div>
                <div className="flex items-start space-x-1">
                  <UsersIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    {/* {cls.memberCount} */}
                    12
                  </span>
                </div>
              </div>
            </div>
            {/* {index === 1 && (
              <span className="hidden w-1/2 items-center justify-center p-3 lg:flex">
                <Image
                  src={cls.img ?? "/placeholder.svg"}
                  alt="placeholder"
                  unoptimized
                  width={0}
                  height={0}
                  className="aspect-square w-[90%] rounded-lg object-cover"
                />
              </span>
            )} */}
            <div className="absolute bottom-0 left-4 right-4 h-1 w-0 rounded-lg bg-muted-foreground transition-all duration-200 ease-in-out group-hover:w-[calc(100%-2rem)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
