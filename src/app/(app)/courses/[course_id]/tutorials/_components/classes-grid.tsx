import Image from "next/image";
import Link from "next/link";

import {
  CalendarClockIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const classes = [
  {
    name: "M10A",
    id: "tut_aoishg3353",
    location: "Quadrangle 1001",
    times: "Mon, 10:00-12:00",
    tutor: "John Doe",
    memberCount: 12,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_desktop/public/images/The%20Quad-25.jpg",
  },
  {
    name: "M10B",
    id: "tut_aoishg3353",
    location: "Quadrangle 1001",
    times: "Mon, 10:00-12:00",
    tutor: "John Doe",
    memberCount: 9,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_desktop/public/images/The%20Quad-25.jpg",
  },
  {
    name: "T09A",
    id: "tut_bpjtih4465",
    location: "Quadrangle 1002",
    times: "Tue, 09:00-11:00",
    tutor: "Jane Doe",
    memberCount: 21,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_desktop/public/images/The%20Quad-25.jpg",
  },
  {
    name: "T09B",
    id: "tut_bpjtih4465",
    location: "Squarehouse 114",
    times: "Tue, 09:00-11:00",
    tutor: "Jane Doe",
    memberCount: 25,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_mobile/public/images/squarehouse_0.jpg?itok=nI8heB1-",
  },
  {
    name: "W08A",
    id: "tut_cqkuji5576",
    location: "Ainsworth G03",
    times: "Wed, 08:00-10:00",
    tutor: "Jack Doe",
    memberCount: 12,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_mobile/public/images/ainsworth-building_0.jpg",
  },
  {
    name: "W08B",
    id: "tut_cqkuji5576",
    location: "Quadrangle G025",
    times: "Wed, 08:00-10:00",
    tutor: "Jack Doe",
    memberCount: 16,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_mobile/public/images/The%20Quad-25.jpg",
  },
  {
    name: "H14A",
    id: "tut_drlvkj6687",
    location: "Squarehouse G025",
    times: "Thu, 14:00-16:00",
    tutor: "Jill Doe",
    memberCount: 10,
  },
  {
    name: "H14B",
    id: "tut_drlvkj6687",
    location: "UNSW Business School 114",
    times: "Thu, 14:00-16:00",
    tutor: "Jill Doe",
    memberCount: 12,
    img: "https://www.learningenvironments.unsw.edu.au/sites/default/files/styles/teaser_desktop/public/images/ARC_funding_banner.jpg",
  },
  {
    name: "F13A",
    id: "tut_esmwlk7798",
    location: "Quadrangle 1003",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 19,
  },
  {
    name: "F13B",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
  {
    name: "F13C",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
  {
    name: "F13D",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
  {
    name: "F13E",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
  {
    name: "F13F",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
  {
    name: "F13G",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
  {
    name: "F13H",
    id: "tut_esmwlk7798",
    location: "Quadrangle G024",
    times: "Fri, 13:00-15:00",
    tutor: "Jenny Doe",
    memberCount: 11,
  },
];
export default function ClassesGrid() {
  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="relative ml-auto flex-1 md:grow-0">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for a class..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 min-[870px]:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5">
        {classes.map((cls, index) => (
          <Link
            href={`tutorials/${cls.id}`}
            key={cls.id}
            className={cn(
              "group relative flex aspect-square justify-between rounded-lg border border-border bg-card shadow-lg hover:cursor-pointer",
              "transition-all duration-100",
              index === 0 && "sm:col-span-2 sm:row-span-2 sm:aspect-square",
              index === 1 &&
                "col-span-1 sm:hover:row-span-2 sm:hover:aspect-auto lg:col-span-2 lg:aspect-[2/1] lg:hover:row-span-1 lg:hover:aspect-[2/1]",
              index > 1 && "sm:hover:row-span-2 sm:hover:aspect-auto",
            )}
          >
            <div className="relative flex h-full grow flex-col items-start justify-between space-y-2 p-4">
              <span className="text-3xl font-medium text-card-foreground">
                {cls.name}
              </span>
              <div className="flex w-full flex-grow overflow-hidden">
                <Image
                  src={cls.img ?? "/placeholder.svg"}
                  alt="placeholder"
                  unoptimized
                  width={0}
                  height={0}
                  className={cn(
                    "rounded-lg object-cover transition-opacity duration-200 ease-in",
                    index === 0 &&
                      "hidden h-full w-full rounded-lg object-cover sm:block",
                    index === 1 &&
                      "opacity-0 max-lg:group-hover:opacity-100 sm:group-hover:grow lg:group-hover:grow-0",
                    index > 1 &&
                      "opacity-0 group-hover:opacity-100 sm:group-hover:grow",
                  )}
                />
              </div>
              <div className="space-y-2 rounded-md text-sm text-muted-foreground">
                <div className="flex items-start space-x-1">
                  <MapPinIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    {cls.location}
                  </span>
                </div>
                <div className="flex items-start space-x-1">
                  <CalendarClockIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    {cls.times}
                  </span>
                </div>
                <div className="flex items-start space-x-1">
                  <UsersIcon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1 text-pretty leading-none group-hover:line-clamp-2">
                    {cls.memberCount}
                  </span>
                </div>
              </div>
            </div>
            {index === 1 && (
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
            )}
            <div className="absolute bottom-0 left-4 right-4 h-1 w-0 rounded-lg bg-muted-foreground transition-all duration-200 ease-in-out group-hover:w-[calc(100%-2rem)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
